/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
"use client";
import { initializePaddle } from "@paddle/paddle-js";
import type { Paddle } from "@paddle/paddle-js";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

export default function Checkout() {
  // Create a local state to store Paddle instance
  const [paddle, setPaddle] = useState<Paddle>();
  const session = useSession();

  // Download and initialize Paddle instance from CDN
  useEffect(() => {
    const paddleInit = async () => {
      try {
        const paddleInstance = await initializePaddle({
          environment: "sandbox",
          token: "test_8ff4c37b80e525f2e23882f208b",
          checkout: {
            settings: {
              displayMode: "overlay",
              variant: "one-page",
            },
          },
          eventCallback: function (data) {
            type PaddleEventName =
              | "checkout.loaded"
              | "checkout.customer.created"
              | "checkout.completed";
            switch (data.name as PaddleEventName) {
              case "checkout.loaded":
                console.log("Checkout opened");
                break;
              case "checkout.customer.created":
                console.log("Customer created");
                break;
              case "checkout.completed":
                console.log("Checkout completed");
                break;
              default:
                console.log(data);
            }
            console.log(data);
          },
        });

        if (paddleInstance) {
          setPaddle(paddleInstance);
        }
      } catch (error) {
        console.error("Error initializing Paddle", error);
      }
    };
    void paddleInit();
  }, []);

  return (
    <>
      <Button
        onClick={() => {
          paddle?.Checkout.open({
            customer: {
              email: session.data?.user.email as string,
            },
            items: [{ priceId: "pri_01j86qhjafvgvdzbc1rwjc8czk", quantity: 1 }],
            customData: {
              email: session.data?.user.email as string,
              id: session.data?.user.id as string,
            },
          });
        }}
      >
        Open Checkout
      </Button>
    </>
  );
}
