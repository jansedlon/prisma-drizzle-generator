import { relations } from "drizzle-orm";
import { sessions } from "./sessions.js";
import { users } from "./users.js";

export const sessionsRelations = relations(sessions, (helpers) => ({
  user: helpers.one(users, {
    relationName: "SessionToUser",
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
