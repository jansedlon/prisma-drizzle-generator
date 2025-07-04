import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { emailEventTypeEnum } from "./email-event-type-enum.js";

export const emailEvents = pgTable("EmailEvent", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  emailId: text("emailId").notNull(),
  eventType: emailEventTypeEnum("eventType").notNull(),
  detail: jsonb("detail"),
  bounceType: text("bounceType"),
  bounceSubType: text("bounceSubType"),
  bounceMessage: text("bounceMessage"),
  complaintFeedback: text("complaintFeedback"),
  eventTimestamp: timestamp("eventTimestamp", {
    mode: "date",
    precision: 3,
  }).notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .$onUpdateFn(() => new Date())
    .notNull(),
});
