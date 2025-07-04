import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const communities = pgTable("Community", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  storeId: text("storeId").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  membersCount: integer("membersCount").notNull(),
  banner: text("banner"),
  activePostsCount: integer("activePostsCount").default(0).notNull(),
  allowMembersToPost: boolean("allowMembersToPost").default(true).notNull(),
  allowMembersPostToFeed: boolean("allowMembersPostToFeed")
    .default(true)
    .notNull(),
  allowMembersToSeeMembers: boolean("allowMembersToSeeMembers")
    .default(true)
    .notNull(),
  allowMembersToChat: boolean("allowMembersToChat").default(false).notNull(),
  canMessageCommunityOwner: boolean("canMessageCommunityOwner")
    .default(true)
    .notNull(),
  lastPostNotificationSentAt: timestamp("lastPostNotificationSentAt", {
    mode: "date",
    precision: 3,
  }),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  deletedAt: timestamp("deletedAt", { mode: "date", precision: 3 }),
});
