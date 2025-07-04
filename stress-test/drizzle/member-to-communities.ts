import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { communityMemberRoleEnum } from "./community-member-role-enum.js";

export const memberToCommunities = pgTable("MemberToCommunity", {
  memberId: text("memberId"),
  communityId: text("communityId").notNull(),
  userId: text("userId").notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  role: communityMemberRoleEnum("role").default("MEMBER").notNull(),
  allowEmailNotifications: boolean("allowEmailNotifications")
    .default(true)
    .notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  bannedAt: timestamp("bannedAt", { mode: "date", precision: 3 }),
});
