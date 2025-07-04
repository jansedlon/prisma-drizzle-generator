import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { subscriptionV2FeatureLimitTypeEnum } from "./subscription-v-2-feature-limit-type-enum.js";
import { subscriptionV2FeatureValueTypeEnum } from "./subscription-v-2-feature-value-type-enum.js";

export const subscriptionV2Features = pgTable("SubscriptionV2Feature", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  order: integer("order").notNull(),
  title: text("title"),
  name: text("name"),
  type: subscriptionV2FeatureLimitTypeEnum("type").notNull(),
  value: integer("value").notNull(),
  valueType: subscriptionV2FeatureValueTypeEnum("valueType")
    .default("NUMBER")
    .notNull(),
  href: text("href"),
  badge: text("badge"),
  accumulate: boolean("accumulate").default(false).notNull(),
  subscriptionProductId: text("subscriptionProductId").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
