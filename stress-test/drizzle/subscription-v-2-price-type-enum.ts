import { pgEnum } from "drizzle-orm/pg-core";

export const subscriptionV2PriceTypeEnum = pgEnum("SubscriptionV2PriceType", [
  "ONE_TIME",
  "RECURRING",
]);
