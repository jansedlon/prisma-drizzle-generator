import { relations } from "drizzle-orm";
import { communityPostCategories } from "./community-post-categories.js";
import { communities } from "./communities.js";
import { posts } from "./posts.js";
import { notificationSettings } from "./notification-settings.js";

export const communityPostCategoriesRelations = relations(
  communityPostCategories,
  (helpers) => ({
    community: helpers.one(communities, {
      relationName: "CommunityToCommunityPostCategory",
      fields: [communityPostCategories.communityId],
      references: [communities.id],
    }),
    posts: helpers.many(posts, { relationName: "CommunityPostCategoryToPost" }),
    notificationSettings: helpers.many(notificationSettings, {
      relationName: "CommunityPostCategoryToNotificationSetting",
    }),
  }),
);
