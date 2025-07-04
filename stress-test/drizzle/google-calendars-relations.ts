import { relations } from "drizzle-orm";
import { googleCalendars } from "./google-calendars.js";
import { users } from "./users.js";
import { googleCalendarAccounts } from "./google-calendar-accounts.js";
import { googleCalendarEvents } from "./google-calendar-events.js";

export const googleCalendarsRelations = relations(
  googleCalendars,
  (helpers) => ({
    user: helpers.one(users, {
      relationName: "GoogleCalendarToUser",
      fields: [googleCalendars.userId],
      references: [users.id],
    }),
    account: helpers.one(googleCalendarAccounts, {
      relationName: "GoogleCalendarToGoogleCalendarAccount",
      fields: [googleCalendars.accountId],
      references: [googleCalendarAccounts.id],
    }),
    googleCalendarEvents: helpers.many(googleCalendarEvents, {
      relationName: "GoogleCalendarToGoogleCalendarEvent",
    }),
  }),
);
