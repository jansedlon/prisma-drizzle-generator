import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { communityMemberRoleEnum } from "./community-member-role-enum.js";
import type { CommunityInvitationStatus } from "@flixydev/flixy-types/prisma";

export const communityInvitations = pgTable("CommunityInvitation", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  communityId: text("communityId").notNull(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  role: communityMemberRoleEnum("role").notNull(),
  expiresAt: timestamp("expiresAt", { mode: "date", precision: 3 }).notNull(),
  status: text("status").$type<CommunityInvitationStatus>().notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
