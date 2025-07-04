import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const userNotificationPreferences = pgTable(
  "UserNotificationPreference",
  {
    userId: text("userId").notNull(),
    notificationPreferenceId: text("notificationPreferenceId").notNull(),
    enabled: boolean("enabled").default(true).notNull(),
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
);
