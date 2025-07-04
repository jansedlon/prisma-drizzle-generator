import { pgTable, text } from "drizzle-orm/pg-core";

export const passwords = pgTable("Password", {
  hash: text("hash").notNull(),
  userId: text("userId").notNull(),
});
