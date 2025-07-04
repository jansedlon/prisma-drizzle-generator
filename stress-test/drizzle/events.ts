import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const events = pgTable("Event", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text("userId"),
  name: text("name").notNull(),
  data: jsonb("data").notNull(),
  resource: text("resource"),
  description: text("description"),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
});
