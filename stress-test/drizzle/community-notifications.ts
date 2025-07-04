import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { communityNotificationTypeEnum } from "./community-notification-type-enum.js";
import type { CommunityNotificationEvent } from "@flixydev/flixy-types/prisma";

export const communityNotifications = pgTable("CommunityNotification", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  memberId: text("memberId"),
  userId: text("userId").notNull(),
  type: communityNotificationTypeEnum("type").notNull(),
  payload: jsonb("payload").$type<CommunityNotificationEvent>().notNull(),
  sentAt: timestamp("sentAt", { mode: "date", precision: 3 }),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
