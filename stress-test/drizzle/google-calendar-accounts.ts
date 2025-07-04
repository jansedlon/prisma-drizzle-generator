import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { googleCalendarAccountStatusEnum } from "./google-calendar-account-status-enum.js";

export const googleCalendarAccounts = pgTable("GoogleCalendarAccount", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  sub: text("sub").notNull(),
  refreshToken: text("refreshToken").notNull(),
  scopes: text("scopes").array().notNull(),
  userData: jsonb("userData").notNull(),
  lastSyncedAt: timestamp("lastSyncedAt", {
    mode: "date",
    precision: 3,
  }).notNull(),
  nextSyncToken: text("nextSyncToken").notNull(),
  userId: text("userId").notNull(),
  status: googleCalendarAccountStatusEnum("status")
    .default("SYNCHRONIZED")
    .notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
