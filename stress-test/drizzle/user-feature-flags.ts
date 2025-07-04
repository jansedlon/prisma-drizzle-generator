import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const userFeatureFlags = pgTable("UserFeatureFlag", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text("userId").notNull(),
  featureFlagId: text("featureFlagId").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
