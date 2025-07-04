import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const verifications = pgTable("Verification", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  type: text("type").notNull(),
  target: text("target").notNull(),
  secret: text("secret").notNull(),
  algorithm: text("algorithm").notNull(),
  digits: integer("digits").notNull(),
  period: integer("period").notNull(),
  charSet: text("charSet").notNull(),
  expiresAt: timestamp("expiresAt", { mode: "date", precision: 3 }),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
});
