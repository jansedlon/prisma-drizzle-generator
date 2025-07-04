import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const googleCalendarEvents = pgTable("GoogleCalendarEvent", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  iCalUID: text("iCalUID").notNull(),
  opaqueId: text("opaqueId").notNull(),
  start: timestamp("start", { mode: "date", precision: 3 }).notNull(),
  startTimezone: text("startTimezone").notNull(),
  end: timestamp("end", { mode: "date", precision: 3 }).notNull(),
  endTimezone: text("endTimezone").notNull(),
  status: text("status").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  eventType: text("eventType").notNull(),
  location: text("location"),
  visibility: text("visibility"),
  recurrence: text("recurrence").array().default([]).notNull(),
  recurrenceUntil: timestamp("recurrenceUntil", { mode: "date", precision: 3 }),
  created: timestamp("created", { mode: "date", precision: 3 }).notNull(),
  updated: timestamp("updated", { mode: "date", precision: 3 }).notNull(),
  calendarId: text("calendarId").notNull(),
  meetingBookingId: text("meetingBookingId"),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
