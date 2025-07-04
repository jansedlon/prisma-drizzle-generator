import { relations } from "drizzle-orm";
import { communityNotifications } from "./community-notifications.js";
import { members } from "./members.js";
import { users } from "./users.js";

export const communityNotificationsRelations = relations(
  communityNotifications,
  (helpers) => ({
    member: helpers.one(members, {
      relationName: "CommunityNotificationToMember",
      fields: [communityNotifications.memberId],
      references: [members.id],
    }),
    user: helpers.one(users, {
      relationName: "CommunityNotificationToUser",
      fields: [communityNotifications.userId],
      references: [users.id],
    }),
  }),
);
