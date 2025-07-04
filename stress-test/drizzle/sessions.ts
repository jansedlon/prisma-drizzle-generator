import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const sessions = pgTable("Session", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  userId: text("userId").notNull(),
  impersonatedBy: text("impersonatedBy"),
  expirationDate: timestamp("expirationDate", {
    mode: "date",
    precision: 3,
  }).notNull(),
});
