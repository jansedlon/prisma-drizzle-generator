import { relations } from "drizzle-orm";
import { googleCalendarEvents } from "./google-calendar-events.js";
import { googleCalendars } from "./google-calendars.js";
import { meetingBookings } from "./meeting-bookings.js";
import { googleCalendarEventExceptions } from "./google-calendar-event-exceptions.js";

export const googleCalendarEventsRelations = relations(
  googleCalendarEvents,
  (helpers) => ({
    calendar: helpers.one(googleCalendars, {
      relationName: "GoogleCalendarToGoogleCalendarEvent",
      fields: [googleCalendarEvents.calendarId],
      references: [googleCalendars.id],
    }),
    meetingBooking: helpers.one(meetingBookings, {
      relationName: "GoogleCalendarEventToMeetingBooking",
      fields: [googleCalendarEvents.meetingBookingId],
      references: [meetingBookings.id],
    }),
    exceptions: helpers.many(googleCalendarEventExceptions, {
      relationName: "GoogleCalendarEventToGoogleCalendarEventException",
    }),
  }),
);
