import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const meetings = pgTable("Meeting", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  beforeBufferTime: integer("beforeBufferTime"),
  afterBufferTime: integer("afterBufferTime"),
  attendeesLimit: integer("attendeesLimit").notNull(),
  bookWithinNextNDays: integer("bookWithinNextNDays").notNull(),
  durationMinutes: integer("durationMinutes").notNull(),
  meetingPrepHours: integer("meetingPrepHours").notNull(),
  timezone: text("timezone").notNull(),
  productId: text("productId").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
