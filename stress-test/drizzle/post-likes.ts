import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const postLikes = pgTable("PostLike", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  postId: text("postId").notNull(),
  memberId: text("memberId"),
  userId: text("userId").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
});
