import { relations } from "drizzle-orm";
import { postComments } from "./post-comments.js";
import { posts } from "./posts.js";
import { members } from "./members.js";
import { users } from "./users.js";
import { commentLikes } from "./comment-likes.js";

export const postCommentsRelations = relations(postComments, (helpers) => ({
  post: helpers.one(posts, {
    relationName: "PostToPostComment",
    fields: [postComments.postId],
    references: [posts.id],
  }),
  member: helpers.one(members, {
    relationName: "MemberToPostComment",
    fields: [postComments.memberId],
    references: [members.id],
  }),
  user: helpers.one(users, {
    relationName: "PostCommentToUser",
    fields: [postComments.userId],
    references: [users.id],
  }),
  parentComment: helpers.one(postComments, {
    relationName: "CommentReplies",
    fields: [postComments.parentCommentId],
    references: [postComments.id],
  }),
  replies: helpers.many(postComments, { relationName: "CommentReplies" }),
  likes: helpers.many(commentLikes, {
    relationName: "CommentLikeToPostComment",
  }),
}));
