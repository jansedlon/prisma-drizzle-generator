import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { communityPostCategoryPermissionEnum } from "./community-post-category-permission-enum.js";

export const communityPostCategories = pgTable("CommunityPostCategory", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  position: integer("position").default(999).notNull(),
  communityId: text("communityId").notNull(),
  permission: communityPostCategoryPermissionEnum("permission").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deletedAt", { mode: "date", precision: 3 }),
});
