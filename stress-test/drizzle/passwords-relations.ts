import { relations } from "drizzle-orm";
import { passwords } from "./passwords.js";
import { users } from "./users.js";

export const passwordsRelations = relations(passwords, (helpers) => ({
  user: helpers.one(users, {
    relationName: "PasswordToUser",
    fields: [passwords.userId],
    references: [users.id],
  }),
}));
