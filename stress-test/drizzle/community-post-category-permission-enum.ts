import { pgEnum } from "drizzle-orm/pg-core";

export const communityPostCategoryPermissionEnum = pgEnum(
  "CommunityPostCategoryPermission",
  ["ANYONE_WRITE", "ADMINS_WRITE"],
);
