import { relations } from "drizzle-orm";
import { googleCalendarEventExceptions } from "./google-calendar-event-exceptions.js";
import { googleCalendarEvents } from "./google-calendar-events.js";

export const googleCalendarEventExceptionsRelations = relations(
  googleCalendarEventExceptions,
  (helpers) => ({
    googleCalendarEvent: helpers.one(googleCalendarEvents, {
      relationName: "GoogleCalendarEventToGoogleCalendarEventException",
      fields: [googleCalendarEventExceptions.googleCalendarEventId],
      references: [googleCalendarEvents.id],
    }),
  }),
);
