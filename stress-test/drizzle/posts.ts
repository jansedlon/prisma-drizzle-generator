import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const posts = pgTable("Post", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  categoryId: text("categoryId"),
  communityId: text("communityId").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  banner: text("banner"),
  authorId: text("authorId"),
  userId: text("userId").notNull(),
  pinnedAt: timestamp("pinnedAt", { mode: "date", precision: 3 }),
  likesCount: integer("likesCount").default(0).notNull(),
  commentsCount: integer("commentsCount").default(0).notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
