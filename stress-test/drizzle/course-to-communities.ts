import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { courseToCommunityAccessTypeEnum } from "./course-to-community-access-type-enum.js";

export const courseToCommunities = pgTable("CourseToCommunity", {
  courseId: text("courseId").notNull(),
  communityId: text("communityId").notNull(),
  accessType: courseToCommunityAccessTypeEnum("accessType")
    .default("FREE")
    .notNull(),
  storeProductId: text("storeProductId"),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deletedAt", { mode: "date", precision: 3 }),
});
