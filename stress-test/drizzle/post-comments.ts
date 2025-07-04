import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const postComments = pgTable("PostComment", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  content: text("content").notNull(),
  postId: text("postId").notNull(),
  memberId: text("memberId"),
  userId: text("userId").notNull(),
  parentCommentId: text("parentCommentId"),
  repliesCount: integer("repliesCount").default(0).notNull(),
  likesCount: integer("likesCount").default(0).notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  deletedAt: timestamp("deletedAt", { mode: "date", precision: 3 }),
});
