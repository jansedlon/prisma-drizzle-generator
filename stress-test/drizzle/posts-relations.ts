import { relations } from "drizzle-orm";
import { posts } from "./posts.js";
import { communities } from "./communities.js";
import { communityPostCategories } from "./community-post-categories.js";
import { postAttachments } from "./post-attachments.js";
import { members } from "./members.js";
import { users } from "./users.js";
import { notificationSettings } from "./notification-settings.js";
import { postLikes } from "./post-likes.js";
import { postComments } from "./post-comments.js";

export const postsRelations = relations(posts, (helpers) => ({
  community: helpers.one(communities, {
    relationName: "CommunityToPost",
    fields: [posts.communityId],
    references: [communities.id],
  }),
  category: helpers.one(communityPostCategories, {
    relationName: "CommunityPostCategoryToPost",
    fields: [posts.categoryId],
    references: [communityPostCategories.id],
  }),
  attachments: helpers.many(postAttachments, {
    relationName: "PostToPostAttachment",
  }),
  author: helpers.one(members, {
    relationName: "MemberToPost",
    fields: [posts.authorId],
    references: [members.id],
  }),
  user: helpers.one(users, {
    relationName: "PostToUser",
    fields: [posts.userId],
    references: [users.id],
  }),
  notificationSettings: helpers.many(notificationSettings, {
    relationName: "NotificationSettingToPost",
  }),
  likes: helpers.many(postLikes, { relationName: "PostToPostLike" }),
  comments: helpers.many(postComments, { relationName: "PostToPostComment" }),
}));
