import { relations } from "drizzle-orm";
import { authenticators } from "./authenticators.js";
import { users } from "./users.js";

export const authenticatorsRelations = relations(authenticators, (helpers) => ({
  user: helpers.one(users, {
    relationName: "AuthenticatorToUser",
    fields: [authenticators.userId],
    references: [users.id],
  }),
}));
