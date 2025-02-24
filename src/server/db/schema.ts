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
  boolean,
  json,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

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
  aboutInfo: one(aboutInfo, {
    fields: [users.id],
    references: [aboutInfo.userId],
  }),
  projects: many(projects),
  skills: many(skills),
  resume: one(resume, {
    fields: [users.id],
    references: [resume.userId],
  }),
  settings: one(settings, {
    fields: [users.id],
    references: [settings.userId],
  }),
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

// New tables for portfolio information

export const aboutInfo = createTable("about_info", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  bio: text("bio").notNull(),
  profileImage: varchar("profile_image", { length: 255 }),
  socials: json("socials").$type<{
    twitter?: string;
    github?: string;
    tiktok?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    facebook?: string;
    email?: string;
  }>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const aboutInfoRelations = relations(aboutInfo, ({ one }) => ({
  user: one(users, { fields: [aboutInfo.userId], references: [users.id] }),
}));

export const projects = createTable("projects", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  imageUrl: varchar("image_url", { length: 255 }).notNull(),
  projectUrl: varchar("project_url", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
  skills: many(projectSkills),
}));

export const skills = createTable("skills", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const skillsRelations = relations(skills, ({ one, many }) => ({
  user: one(users, { fields: [skills.userId], references: [users.id] }),
  projects: many(projectSkills),
}));

export const projectSkills = createTable(
  "project_skills",
  {
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    skillId: integer("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.projectId, table.skillId] }), // Composite primary key
  }),
);

export const projectSkillsRelations = relations(projectSkills, ({ one }) => ({
  project: one(projects, {
    fields: [projectSkills.projectId],
    references: [projects.id],
  }),
  skill: one(skills, {
    fields: [projectSkills.skillId],
    references: [skills.id],
  }),
}));

export const resume = createTable("resume", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  summary: text("summary").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const resumeRelations = relations(resume, ({ one, many }) => ({
  user: one(users, { fields: [resume.userId], references: [users.id] }),
  experiences: many(experiences),
}));

export const experiences = createTable("experiences", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  resumeId: integer("resume_id")
    .notNull()
    .references(() => resume.id),
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  startDate: varchar("start_date", { length: 50 }).notNull(),
  endDate: varchar("end_date", { length: 50 }),
  description: text("description").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const experiencesRelations = relations(experiences, ({ one }) => ({
  resume: one(resume, {
    fields: [experiences.resumeId],
    references: [resume.id],
  }),
}));

export const settings = createTable("settings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  primaryColor: varchar("primary_color", { length: 7 }).notNull(),
  darkMode: boolean("dark_mode").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const settingsRelations = relations(settings, ({ one }) => ({
  user: one(users, { fields: [settings.userId], references: [users.id] }),
}));
