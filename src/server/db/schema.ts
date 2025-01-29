import { relations, sql } from "drizzle-orm";
import {
  decimal,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `devcondo_${name}`);

// AUTH SCHEMA
export const posts = createTable(
  "post",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    createdByIdIdx: index("created_by_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  customerId: varchar("customer_id", { length: 255 }),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  subscriptions: one(subscriptions, {
    fields: [users.id],
    references: [subscriptions.userId],
  }), //for simplicity one active subscription only | can be many if needed
  payments: many(payments), //many if subscription or have different offerings | one if one-time payment
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// PAYMENT GATEWAY SCHEMA
// add subscription, transaction, and webhooks here
export const subscriptions = createTable(
  "subscription",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    subscriptionId: varchar("subscription_id", { length: 255 }).notNull(), //Paddle's subscription ID
    status: varchar("status", { length: 255 }).notNull(),
    startDate: timestamp("start_date", { withTimezone: true }).notNull(),
    nextBillingDate: timestamp("next_billing_date", {
      withTimezone: true,
    }).notNull(),
    endDate: timestamp("end_date", { withTimezone: true }).notNull(),
    recurringAmount: decimal("recurring_amount", {
      precision: 10,
      scale: 2,
    }).notNull(),
    currency: varchar("currency", { length: 255 }).notNull(),
    billingInterval: varchar("billing_interval", { length: 255 }).notNull(),
  },
  (subscription) => ({
    userIdIdx: index("subscription_user_id_idx").on(subscription.userId),
  }),
);

export const subscriptionsRelations = relations(
  subscriptions,
  ({ many, one }) => ({
    user: one(users, {
      fields: [subscriptions.userId],
      references: [users.id],
    }), //always the case
    payment: many(payments), //many if subscription | one if one-time payment
  }),
);

export const payments = createTable(
  "payment",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    transactionId: varchar("transaction_id", { length: 255 }).notNull(),
    subscriptionId: integer("subscription_id").references(
      () => subscriptions.id,
    ),
    paymentType: varchar("payment_type", { length: 50 }).notNull(), //one-time or subscription
    paymentStatus: varchar("payment_status", { length: 50 }).notNull(),
    paymentMethod: varchar("payment_method", { length: 50 }),
    status: varchar("status", { length: 50 }).notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 50 }).notNull(),
    paymentDate: timestamp("payment_date", { withTimezone: true }).notNull(),
  },
  (payment) => ({
    userIdIdx: index("payment_user_id_idx").on(payment.userId),
  }),
);

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, { fields: [payments.userId], references: [users.id] }), //always the case
  subscription: one(subscriptions, {
    fields: [payments.subscriptionId],
    references: [subscriptions.id],
  }), //always the case
}));

export const failedPayments = createTable("failed_payment", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  transactionId: varchar("transaction_id", { length: 255 }).notNull(),
  subscriptionId: integer("subscription_id").references(() => subscriptions.id),
  paymentType: varchar("payment_type", { length: 50 }).notNull(), //one-time or subscripti
  paymentStatus: varchar("payment_status", { length: 50 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  status: varchar("status", { length: 50 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 50 }).notNull(),
  paymentDate: timestamp("payment_date", { withTimezone: true }).notNull(),
});

export const failedPaymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, { fields: [payments.userId], references: [users.id] }), //always the case
  subscription: one(subscriptions, {
    fields: [payments.subscriptionId],
    references: [subscriptions.id],
  }), //always the case
}));

// DATABASE SCHEMA
