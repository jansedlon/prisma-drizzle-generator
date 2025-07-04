import { relations } from "drizzle-orm";
import { communityInvitations } from "./community-invitations.js";
import { communities } from "./communities.js";

export const communityInvitationsRelations = relations(
  communityInvitations,
  (helpers) => ({
    community: helpers.one(communities, {
      relationName: "CommunityToCommunityInvitation",
      fields: [communityInvitations.communityId],
      references: [communities.id],
    }),
  }),
);
