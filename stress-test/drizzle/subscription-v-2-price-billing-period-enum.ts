import { pgEnum } from "drizzle-orm/pg-core";

export const subscriptionV2PriceBillingPeriodEnum = pgEnum(
  "SubscriptionV2PriceBillingPeriod",
  ["ONCE", "DAILY", "WEEKLY", "MONTHLY", "YEARLY", "QUARTERLY", "SEMI_ANNUAL"],
);
