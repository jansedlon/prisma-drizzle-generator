import { relations } from "drizzle-orm";
import { messageDocuments } from "./message-documents.js";
import { chatMessages } from "./chat-messages.js";

export const messageDocumentsRelations = relations(
  messageDocuments,
  (helpers) => ({
    message: helpers.one(chatMessages, {
      relationName: "ChatMessageToMessageDocument",
      fields: [messageDocuments.messageId],
      references: [chatMessages.id],
    }),
  }),
);
