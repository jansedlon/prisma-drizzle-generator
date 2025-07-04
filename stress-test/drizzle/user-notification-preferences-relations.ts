import { relations } from "drizzle-orm";
import { userNotificationPreferences } from "./user-notification-preferences.js";
import { users } from "./users.js";
import { notificationPreferences } from "./notification-preferences.js";

export const userNotificationPreferencesRelations = relations(
  userNotificationPreferences,
  (helpers) => ({
    user: helpers.one(users, {
      relationName: "UserToUserNotificationPreference",
      fields: [userNotificationPreferences.userId],
      references: [users.id],
    }),
    notificationPreference: helpers.one(notificationPreferences, {
      relationName: "NotificationPreferenceToUserNotificationPreference",
      fields: [userNotificationPreferences.notificationPreferenceId],
      references: [notificationPreferences.id],
    }),
  }),
);
