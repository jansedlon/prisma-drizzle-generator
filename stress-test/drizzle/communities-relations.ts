import { relations } from "drizzle-orm";
import { communities } from "./communities.js";
import { stores } from "./stores.js";
import { courseToCommunities } from "./course-to-communities.js";
import { appConfigurations } from "./app-configurations.js";
import { memberToCommunities } from "./member-to-communities.js";
import { posts } from "./posts.js";
import { communityPostCategories } from "./community-post-categories.js";
import { communityInvitations } from "./community-invitations.js";
import { notificationSettings } from "./notification-settings.js";

export const communitiesRelations = relations(communities, (helpers) => ({
  store: helpers.one(stores, {
    relationName: "CommunityToStore",
    fields: [communities.storeId],
    references: [stores.id],
  }),
  coursesToCommunity: helpers.many(courseToCommunities, {
    relationName: "CommunityToCourseToCommunity",
  }),
  profitAcceleratorCommunity_: helpers.one(appConfigurations),
  members: helpers.many(memberToCommunities, {
    relationName: "CommunityToMemberToCommunity",
  }),
  posts: helpers.many(posts, { relationName: "CommunityToPost" }),
  postCategories: helpers.many(communityPostCategories, {
    relationName: "CommunityToCommunityPostCategory",
  }),
  invitations: helpers.many(communityInvitations, {
    relationName: "CommunityToCommunityInvitation",
  }),
  notificationSettings: helpers.many(notificationSettings, {
    relationName: "CommunityToNotificationSetting",
  }),
}));
