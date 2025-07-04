import { relations } from "drizzle-orm";
import { notificationPreferences } from "./notification-preferences.js";
import { userNotificationPreferences } from "./user-notification-preferences.js";

export const notificationPreferencesRelations = relations(
  notificationPreferences,
  (helpers) => ({
    userSettings: helpers.many(userNotificationPreferences, {
      relationName: "NotificationPreferenceToUserNotificationPreference",
    }),
  }),
);
