import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const feedbacks = pgTable("Feedback", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text("userId").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
});
