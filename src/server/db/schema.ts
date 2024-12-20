import { relations, sql } from "drizzle-orm";
import {
  index,
  int,
  primaryKey,
  sqliteTableCreator,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `fichajes_${name}`);

export const users = createTable(
  "user",
  {
    id: text("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name", { length: 255 }).notNull(),
    email: text("email", { length: 255 }).notNull(),
    emailVerified: int("email_verified", {
      mode: "timestamp",
    }).default(sql`(unixepoch())`),
    role: text("role", { enum: ["admin", "employee"] })
      .default("employee")
      .notNull(),
    image: text("image", { length: 255 }),
    scheduleId: int("schedule_id").references(() => schedules.id),
  },
  (table) => ({ uniqueEmail: uniqueIndex("unique_email").on(table.email) }),
);

export const clockings = createTable(
  "clockings",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    userId: text("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    clockIn: int("clock_in", { mode: "timestamp" })
      .default(sql`(strftime('%s', 'now'))`)
      .notNull(),
    clockOut: int("clock_out", { mode: "timestamp" }),
  },
  (clocking) => ({
    userIdIdx: index("clocking_user_id_idx").on(clocking.userId),
  }),
);

export const schedules = createTable("schedules", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name", { length: 255 }).notNull(),
});

export const schedulesRelations = relations(schedules, ({ many }) => ({
  schedulesDays: many(schedulesDays),
  users: many(users),
}));

export const schedulesDays = createTable(
  "schedules_days",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    scheduleId: int("schedule_id")
      .notNull()
      .references(() => schedules.id, { onDelete: "cascade" }),
    dayOfWeek: int("day_of_week").notNull(),
    startTime: text("start_time").notNull(),
    endTime: text("end_time").notNull(),
  },
  (table) => ({
    uniqueScheduleTimeSlot: uniqueIndex("unique_schedule_day").on(
      table.scheduleId,
      table.dayOfWeek,
      table.startTime,
    ),
  }),
);

export const schedulesDaysRelations = relations(schedulesDays, ({ one }) => ({
  schedule: one(schedules, {
    fields: [schedulesDays.scheduleId],
    references: [schedules.id],
  }),
}));

export const clockingsRelations = relations(clockings, ({ one }) => ({
  user: one(users, { fields: [clockings.userId], references: [users.id] }),
}));

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  clockings: many(clockings),
  schedules: one(schedules, {
    fields: [users.scheduleId],
    references: [schedules.id],
  }),
}));

export const accounts = createTable(
  "account",
  {
    userId: text("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: text("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: text("provider", { length: 255 }).notNull(),
    providerAccountId: text("provider_account_id", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: text("token_type", { length: 255 }),
    scope: text("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: text("session_state", { length: 255 }),
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
    sessionToken: text("session_token", { length: 255 }).notNull().primaryKey(),
    userId: text("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: int("expires", { mode: "timestamp" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: text("identifier", { length: 255 }).notNull(),
    token: text("token", { length: 255 }).notNull(),
    expires: int("expires", { mode: "timestamp" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
