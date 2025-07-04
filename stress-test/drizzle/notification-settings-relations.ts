import { relations } from "drizzle-orm";
import { notificationSettings } from "./notification-settings.js";
import { users } from "./users.js";
import { communities } from "./communities.js";
import { communityPostCategories } from "./community-post-categories.js";
import { posts } from "./posts.js";
import { chats } from "./chats.js";

export const notificationSettingsRelations = relations(
  notificationSettings,
  (helpers) => ({
    user: helpers.one(users, {
      relationName: "NotificationSettingToUser",
      fields: [notificationSettings.userId],
      references: [users.id],
    }),
    community: helpers.one(communities, {
      relationName: "CommunityToNotificationSetting",
      fields: [notificationSettings.communityId],
      references: [communities.id],
    }),
    category: helpers.one(communityPostCategories, {
      relationName: "CommunityPostCategoryToNotificationSetting",
      fields: [notificationSettings.categoryId],
      references: [communityPostCategories.id],
    }),
    post: helpers.one(posts, {
      relationName: "NotificationSettingToPost",
      fields: [notificationSettings.postId],
      references: [posts.id],
    }),
    conversation: helpers.one(chats, {
      relationName: "ChatToNotificationSetting",
      fields: [notificationSettings.conversationId],
      references: [chats.id],
    }),
  }),
);
