/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Paddle } from "@paddle/paddle-node-sdk";
import type { Environment } from "@paddle/paddle-node-sdk";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { db } from "@/server/db";
import {
  subscriptions,
  payments,
  users,
  failedPayments,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";

// NOTE FOR MYSELF SESSION ISN'T POSSIBLE HERE BECAUSE IT'S A WEBHOOK USE DB DIRECTLY

// Paddle webhook secret and API key
const PADDLE_API_KEY = process.env.PADDLE_API_KEY;
const PADDLE_NOTIFICATION_WEBHOOK_SECRET =
  process.env.PADDLE_NOTIFICATION_WEBHOOK_SECRET;
if (!PADDLE_API_KEY) {
  throw new Error("PADDLE_API_KEY is not defined");
}
if (!PADDLE_NOTIFICATION_WEBHOOK_SECRET) {
  throw new Error("PADDLE_NOTIFICATION_WEBHOOK_SECRET is not defined");
}

// Instantiate Paddle
export const paddle = new Paddle(PADDLE_API_KEY, {
  environment: process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as Environment,
});

// Handle Paddle webhook
export async function POST(req: NextRequest) {
  const signature = req.headers.get("paddle-signature") ?? "";
  const body = await req.text();

  // Verify the webhook signature
  try {
    if (signature && body) {
      const payload = paddle.webhooks.unmarshal(
        body,
        PADDLE_NOTIFICATION_WEBHOOK_SECRET!,
        signature,
      );

      // IF APP IS SOLELY ONE-TIME PAYMENT DO NOT LINK SUBSCRIPTIONS ELSE LINK SUBSCRIPTIONS

      if (payload) {
        type PaddleEventType =
          | "subscription.created"
          | "transaction.completed"
          | "subscription.updated"
          | "transaction.payment_failed"
          | "subscription.past_due";
        switch ((await payload).eventType as PaddleEventType) {
          // SUBSCRIPTION CREATED --------------------------------------------------------
          // FIRST TIME SUBSCRIPTION
          case "subscription.created": //First Time Subscription
            try {
              // Insert subscription and update user with customerId
              await db
                .insert(subscriptions)
                .values({
                  userId: (await payload).data.customData.id,
                  subscriptionId: (await payload).data.id,
                  status: (await payload).data.status,
                  startDate: new Date((await payload).data.firstBilledAt),
                  nextBillingDate: new Date((await payload).data.nextBilledAt),
                  endDate: new Date((await payload).data.nextBilledAt),
                  recurringAmount:
                    (await payload).data.items[0].price.unitPrice.amount / 100,
                  currency: (await payload).data.currencyCode,
                  billingInterval: (await payload).data.billingCycle.interval,
                })
                .returning();

              // Update user with customerId first time subscription
              await db
                .update(users)
                .set({
                  customerId: (await payload).data.customerId,
                })
                .where(eq(users.id, (await payload).data.customData.id));
            } catch (error) {
              console.error(error);
            }
            break;

          // SUBSCRIPTION UPDATED --------------------------------------------------------
          // UPDATING SUBSCRIPTION FOR THE NEXT SUBS AFTER THE FIRST TIME
          case "subscription.updated":
            try {
              await db
                .update(subscriptions)
                .set({
                  nextBillingDate: new Date((await payload).data.nextBilledAt),
                  endDate: new Date(
                    (await payload).data.currentBillingPeriod.endsAt,
                  ),
                })
                .where(
                  eq(
                    subscriptions.subscriptionId,
                    (await payload).data.subscriptionId,
                  ),
                );
            } catch (error) {
              console.error(error);
            }
            break;

          // SUBSCRIPTION PAST DUE --------------------------------------------------------
          // UPDATEING SUBSCRIPTION FOR AUTO-RENEWAL FAILURES
          case "subscription.past_due":
            try {
              await db
                .update(subscriptions)
                .set({
                  status: (await payload).data.status,
                })
                .where(
                  eq(
                    subscriptions.subscriptionId,
                    (await payload).data.subscriptionId,
                  ),
                );
            } catch (error) {
              console.error(error);
            }
          // TRANSACTION PAYMENT FAILED --------------------------------------------------------
          // PAYMENT FAILED FOR THE SUBSCRIPTION FIRST TIME, RENEWAL, OR ONE TIME PAYMENT
          case "transaction.payment_failed":
            try {
              // Check if it is a one-time payment or a subscription payment
              const payloadSubscriptionId = (await payload).data.subscriptionId;

              // If it is a subscription payment
              if (payloadSubscriptionId) {
                const databaseSubscriptionId = await db
                  .select({
                    subId: subscriptions.id,
                    userId: subscriptions.userId,
                  })
                  .from(subscriptions)
                  .where(
                    eq(subscriptions.subscriptionId, payloadSubscriptionId),
                  );

                await db
                  .insert(failedPayments)
                  .values({
                    userId: databaseSubscriptionId[0]?.userId,
                    subscriptionId: databaseSubscriptionId[0]?.subId, //This is the auto-generated id of the subscription in the app
                    status: (await payload).data.status,
                    amount: (await payload).data.payments[0].amount / 100,
                    paymentType: "subscription",
                    paymentStatus: (await payload).data.payments[0].status,
                    paymentMethod: (await payload).data.payments[0]
                      .methodDetails.type,
                    currency: (await payload).data.currencyCode,
                    paymentDate: new Date(
                      (await payload).data.payments[0].createdAt,
                    ),
                    transactionId: (await payload).data.id,
                  })
                  .returning();
              } else {
                // If it is a one-time payment
                await db
                  .insert(failedPayments)
                  .values({
                    userId: (await payload).data.customData.id,
                    subscriptionId: null,
                    status: (await payload).data.status,
                    amount: (await payload).data.payments[0].amount / 100,
                    paymentType: "one-time",
                    paymentStatus: (await payload).data.payments[0].status,
                    paymentMethod: (await payload).data.payments[0]
                      .methodDetails.type,
                    currency: (await payload).data.currencyCode,
                    paymentDate: new Date(
                      (await payload).data.payments[0].createdAt,
                    ),
                    transactionId: (await payload).data.id,
                  })
                  .returning();
              }
            } catch (error) {
              console.error(error);
            }
            break;

          // TRANSACTION COMPLETED --------------------------------------------------------
          // PAYMENT COMPLETED FOR THE SUBSCRIPTION FIRST TIME, RENEWAL, OR ONE TIME PAYMENT
          case "transaction.completed":
            try {
              // Check if it is a one-time payment or a subscription payment
              const payloadSubscriptionId = (await payload).data.subscriptionId;

              // If it is a subscription payment
              if (payloadSubscriptionId) {
                const databaseSubscriptionId = await db
                  .select({
                    subId: subscriptions.id,
                    userId: subscriptions.userId,
                  })
                  .from(subscriptions)
                  .where(
                    eq(subscriptions.subscriptionId, payloadSubscriptionId),
                  );

                await db
                  .insert(payments)
                  .values({
                    userId: databaseSubscriptionId[0]?.userId,
                    subscriptionId: databaseSubscriptionId[0]?.subId, //This is the auto-generated id of the subscription in the app
                    status: (await payload).data.status,
                    amount: (await payload).data.payments[0].amount / 100,
                    paymentType: "subscription",
                    paymentStatus: (await payload).data.payments[0].status,
                    paymentMethod: (await payload).data.payments[0]
                      .methodDetails.type,
                    currency: (await payload).data.currencyCode,
                    paymentDate: new Date(
                      (await payload).data.payments[0].createdAt,
                    ),
                    transactionId: (await payload).data.id,
                  })
                  .returning();
              } else {
                // If it is a one-time payment
                await db
                  .insert(payments)
                  .values({
                    userId: (await payload).data.customData.id,
                    subscriptionId: null,
                    status: (await payload).data.status,
                    amount: (await payload).data.payments[0].amount / 100,
                    paymentType: "one-time",
                    paymentStatus: (await payload).data.payments[0].status,
                    paymentMethod: (await payload).data.payments[0]
                      .methodDetails.type,
                    currency: (await payload).data.currencyCode,
                    paymentDate: new Date(
                      (await payload).data.payments[0].createdAt,
                    ),
                    transactionId: (await payload).data.id,
                  })
                  .returning();
              }
            } catch (error) {
              console.error(error);
            }
            break;

            try {
              await db
                .update(subscriptions)
                .set({
                  status: (await payload).data.status,
                })
                .where(
                  eq(
                    subscriptions.subscriptionId,
                    (await payload).data.subscriptionId,
                  ),
                );
            } catch (error) {
              console.error(error);
            }
            break;

          // DEFAULT --------------------------------------------------------
          default:
            console.log("Unhandled event", (await payload).data);
            break;
        }
      } else {
        console.error("Payload is empty");
        throw new Error("Payload is empty");
      }
    } else {
      console.error("Signature missing in header.");
      throw new Error("Signature missing in header.");
    }
  } catch (error) {
    console.error(error);
  }

  return NextResponse.json("Webhook received", { status: 200 });
}
