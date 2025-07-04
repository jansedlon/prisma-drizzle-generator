import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type { NotificationPreferenceId } from "@flixydev/flixy-types/prisma";
import { notificationChannelEnum } from "./notification-channel-enum.js";

export const notificationPreferences = pgTable("NotificationPreference", {
  id: text("id").$type<NotificationPreferenceId>().primaryKey(),
  internalName: text("internalName").notNull(),
  channel: notificationChannelEnum("channel").default("EMAIL").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
