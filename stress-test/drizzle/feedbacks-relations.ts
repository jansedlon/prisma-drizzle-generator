import { relations } from "drizzle-orm";
import { feedbacks } from "./feedbacks.js";
import { users } from "./users.js";

export const feedbacksRelations = relations(feedbacks, (helpers) => ({
  user: helpers.one(users, {
    relationName: "FeedbackToUser",
    fields: [feedbacks.userId],
    references: [users.id],
  }),
}));
