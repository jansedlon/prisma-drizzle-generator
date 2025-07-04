import { relations } from "drizzle-orm";
import { chatMessages } from "./chat-messages.js";
import { chats } from "./chats.js";
import { members } from "./members.js";
import { users } from "./users.js";
import { messageDocuments } from "./message-documents.js";

export const chatMessagesRelations = relations(chatMessages, (helpers) => ({
  chat: helpers.one(chats, {
    relationName: "ChatToChatMessage",
    fields: [chatMessages.chatId],
    references: [chats.id],
  }),
  member: helpers.one(members, {
    relationName: "ChatMessageToMember",
    fields: [chatMessages.memberId],
    references: [members.id],
  }),
  user: helpers.one(users, {
    relationName: "ChatMessageToUser",
    fields: [chatMessages.userId],
    references: [users.id],
  }),
  documents: helpers.many(messageDocuments, {
    relationName: "ChatMessageToMessageDocument",
  }),
}));
