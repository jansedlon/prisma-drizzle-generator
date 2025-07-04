import { relations } from "drizzle-orm";
import { meetingBookings } from "./meeting-bookings.js";
import { meetings } from "./meetings.js";
import { googleCalendarEvents } from "./google-calendar-events.js";

export const meetingBookingsRelations = relations(
  meetingBookings,
  (helpers) => ({
    meeting: helpers.one(meetings, {
      relationName: "MeetingToMeetingBooking",
      fields: [meetingBookings.meetingId],
      references: [meetings.id],
    }),
    googleCalendarEvent: helpers.one(googleCalendarEvents),
  }),
);
