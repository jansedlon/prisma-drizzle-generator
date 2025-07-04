import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { subscriptionV2PriceTypeEnum } from "./subscription-v-2-price-type-enum.js";
import { subscriptionV2PriceBillingPeriodEnum } from "./subscription-v-2-price-billing-period-enum.js";

export const subscriptionV2Prices = pgTable("SubscriptionV2Price", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  stripeId: text("stripeId").notNull(),
  type: subscriptionV2PriceTypeEnum("type").notNull(),
  billingPeriod:
    subscriptionV2PriceBillingPeriodEnum("billingPeriod").notNull(),
  price: integer("price").notNull(),
  trialDays: integer("trialDays").notNull(),
  active: boolean("active").notNull(),
  subscriptionProductId: text("subscriptionProductId").notNull(),
  currencyCode: text("currencyCode").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
