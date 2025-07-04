import { pgTable, text, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import type {
  NotificationSettingChannels,
  NotificationSettingEventTypes,
} from "@flixydev/flixy-types/prisma";

export const notificationSettings = pgTable("NotificationSetting", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text("userId").notNull(),
  communityId: text("communityId"),
  categoryId: text("categoryId"),
  postId: text("postId"),
  conversationId: text("conversationId"),
  channels: jsonb("channels").$type<NotificationSettingChannels>(),
  eventTypes: jsonb("eventTypes").$type<NotificationSettingEventTypes>(),
  enabled: boolean("enabled").default(true).notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
