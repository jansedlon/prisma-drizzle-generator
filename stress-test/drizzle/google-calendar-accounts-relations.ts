import { relations } from "drizzle-orm";
import { googleCalendarAccounts } from "./google-calendar-accounts.js";
import { googleCalendars } from "./google-calendars.js";
import { users } from "./users.js";

export const googleCalendarAccountsRelations = relations(
  googleCalendarAccounts,
  (helpers) => ({
    googleCalendarAccountCalendars: helpers.many(googleCalendars, {
      relationName: "GoogleCalendarToGoogleCalendarAccount",
    }),
    user: helpers.one(users, {
      relationName: "GoogleCalendarAccountToUser",
      fields: [googleCalendarAccounts.userId],
      references: [users.id],
    }),
  }),
);
