import { pgEnum } from "drizzle-orm/pg-core";

export const communityMemberRoleEnum = pgEnum("CommunityMemberRole", [
  "OWNER",
  "ADMIN",
  "MEMBER",
]);
