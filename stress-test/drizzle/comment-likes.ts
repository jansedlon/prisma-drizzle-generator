import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const commentLikes = pgTable("CommentLike", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  commentId: text("commentId").notNull(),
  memberId: text("memberId"),
  userId: text("userId").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
});
