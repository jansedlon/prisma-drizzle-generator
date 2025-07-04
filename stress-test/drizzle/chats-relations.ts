import { relations } from "drizzle-orm";
import { chats } from "./chats.js";
import { memberToChats } from "./member-to-chats.js";
import { chatMessages } from "./chat-messages.js";
import { notificationSettings } from "./notification-settings.js";

export const chatsRelations = relations(chats, (helpers) => ({
  participants: helpers.many(memberToChats, {
    relationName: "ChatToMemberToChat",
  }),
  messages: helpers.many(chatMessages, { relationName: "ChatToChatMessage" }),
  notificationSettings: helpers.many(notificationSettings, {
    relationName: "ChatToNotificationSetting",
  }),
}));
