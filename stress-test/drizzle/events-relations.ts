import { relations } from "drizzle-orm";
import { events } from "./events.js";
import { users } from "./users.js";

export const eventsRelations = relations(events, (helpers) => ({
  user: helpers.one(users, {
    relationName: "EventToUser",
    fields: [events.userId],
    references: [users.id],
  }),
}));
