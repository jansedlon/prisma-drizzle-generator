import { pgEnum } from "drizzle-orm/pg-core";

export const communityNotificationTypeEnum = pgEnum(
  "CommunityNotificationType",
  ["NEW_POST", "NEW_COMMENT", "REPLY_COMMENT", "MENTION", "UNREAD_MESSAGES"],
);
