import { relations } from "drizzle-orm";
import { postLikes } from "./post-likes.js";
import { posts } from "./posts.js";
import { members } from "./members.js";
import { users } from "./users.js";

export const postLikesRelations = relations(postLikes, (helpers) => ({
  post: helpers.one(posts, {
    relationName: "PostToPostLike",
    fields: [postLikes.postId],
    references: [posts.id],
  }),
  member: helpers.one(members, {
    relationName: "MemberToPostLike",
    fields: [postLikes.memberId],
    references: [members.id],
  }),
  user: helpers.one(users, {
    relationName: "PostLikeToUser",
    fields: [postLikes.userId],
    references: [users.id],
  }),
}));
