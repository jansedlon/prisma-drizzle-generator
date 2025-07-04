import { relations } from "drizzle-orm";
import { memberToCommunities } from "./member-to-communities.js";
import { members } from "./members.js";
import { communities } from "./communities.js";
import { users } from "./users.js";

export const memberToCommunitiesRelations = relations(
  memberToCommunities,
  (helpers) => ({
    member: helpers.one(members, {
      relationName: "MemberToMemberToCommunity",
      fields: [memberToCommunities.memberId],
      references: [members.id],
    }),
    community: helpers.one(communities, {
      relationName: "CommunityToMemberToCommunity",
      fields: [memberToCommunities.communityId],
      references: [communities.id],
    }),
    user: helpers.one(users, {
      relationName: "MemberToCommunityToUser",
      fields: [memberToCommunities.userId],
      references: [users.id],
    }),
  }),
);
