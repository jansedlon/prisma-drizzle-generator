import { relations } from "drizzle-orm";
import { memberToChats } from "./member-to-chats.js";
import { members } from "./members.js";
import { users } from "./users.js";
import { chats } from "./chats.js";

export const memberToChatsRelations = relations(memberToChats, (helpers) => ({
  member: helpers.one(members, {
    relationName: "MemberToMemberToChat",
    fields: [memberToChats.memberId],
    references: [members.id],
  }),
  user: helpers.one(users, {
    relationName: "MemberToChatToUser",
    fields: [memberToChats.userId],
    references: [users.id],
  }),
  chat: helpers.one(chats, {
    relationName: "ChatToMemberToChat",
    fields: [memberToChats.chatId],
    references: [chats.id],
  }),
}));
