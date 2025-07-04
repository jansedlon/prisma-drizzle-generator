import { relations } from "drizzle-orm";
import { memberSessions } from "./member-sessions.js";
import { members } from "./members.js";

export const memberSessionsRelations = relations(memberSessions, (helpers) => ({
  member: helpers.one(members, {
    relationName: "MemberToMemberSession",
    fields: [memberSessions.memberId],
    references: [members.id],
  }),
}));
