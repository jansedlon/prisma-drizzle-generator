import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { featureFlagTypeEnum } from "./feature-flag-type-enum.js";

export const featureFlags = pgTable("FeatureFlag", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: featureFlagTypeEnum("type").notNull(),
  enabled: boolean("enabled").default(false).notNull(),
  rolloutPercentage: integer("rolloutPercentage"),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
