import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { subscriptionV2ModelEnum } from "./subscription-v-2-model-enum.js";

export const subscriptionV2Products = pgTable("SubscriptionV2Product", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  stripeId: text("stripeId").notNull(),
  order: integer("order").notNull(),
  title: text("title").notNull(),
  active: boolean("active").notNull(),
  model: subscriptionV2ModelEnum("model").notNull(),
  public: boolean("public").notNull(),
  description: text("description"),
  badge: text("badge"),
  isLegacy: boolean("isLegacy").default(false).notNull(),
  isBeta: boolean("isBeta").default(false).notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
