import { relations } from "drizzle-orm";
import { commentLikes } from "./comment-likes.js";
import { postComments } from "./post-comments.js";
import { members } from "./members.js";
import { users } from "./users.js";

export const commentLikesRelations = relations(commentLikes, (helpers) => ({
  comment: helpers.one(postComments, {
    relationName: "CommentLikeToPostComment",
    fields: [commentLikes.commentId],
    references: [postComments.id],
  }),
  member: helpers.one(members, {
    relationName: "CommentLikeToMember",
    fields: [commentLikes.memberId],
    references: [members.id],
  }),
  user: helpers.one(users, {
    relationName: "CommentLikeToUser",
    fields: [commentLikes.userId],
    references: [users.id],
  }),
}));
