import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const umzugMigrations = pgTable("UmzugMigration", {
  migrationName: text("migrationName").primaryKey(),
  ranAt: timestamp("ranAt", { mode: "date", precision: 3 }).notNull(),
});
