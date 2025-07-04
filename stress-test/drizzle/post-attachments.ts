import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const postAttachments = pgTable("PostAttachment", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  type: text("type").notNull(),
  location: text("location").notNull(),
  size: integer("size"),
  filename: text("filename"),
  postId: text("postId"),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
