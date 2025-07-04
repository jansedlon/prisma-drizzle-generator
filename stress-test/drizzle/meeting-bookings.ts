import { pgTable, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import type { MeetingBookingAttendee } from "@flixydev/flixy-types/prisma";
import { meetingBookingStatusEnum } from "./meeting-booking-status-enum.js";

export const meetingBookings = pgTable("MeetingBooking", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  attendeesLimit: integer("attendeesLimit").notNull(),
  attendees: jsonb("attendees")
    .array()
    .$type<MeetingBookingAttendee>()
    .notNull(),
  meetingId: text("meetingId").notNull(),
  start: timestamp("start", { mode: "date", precision: 3 }).notNull(),
  end: timestamp("end", { mode: "date", precision: 3 }).notNull(),
  afterBufferTime: integer("afterBufferTime"),
  beforeBufferTime: integer("beforeBufferTime"),
  durationMinutes: integer("durationMinutes"),
  meetingLink: text("meetingLink"),
  status: meetingBookingStatusEnum("status").default("BOOKED").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
