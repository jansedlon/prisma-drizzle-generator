import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const memberSessions = pgTable("MemberSession", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  memberId: text("memberId").notNull(),
  expirationDate: timestamp("expirationDate", {
    mode: "date",
    precision: 3,
  }).notNull(),
});
