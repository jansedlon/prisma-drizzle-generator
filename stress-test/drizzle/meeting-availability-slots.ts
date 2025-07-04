import { pgTable, text, integer, time, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const meetingAvailabilitySlots = pgTable("MeetingAvailabilitySlot", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  meetingId: text("meetingId").notNull(),
  dayOfWeek: integer("dayOfWeek").notNull(),
  startTime: time("startTime").notNull(),
  endTime: time("endTime").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
