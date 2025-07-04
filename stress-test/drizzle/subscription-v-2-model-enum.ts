import { pgEnum } from "drizzle-orm/pg-core";

export const subscriptionV2ModelEnum = pgEnum("SubscriptionV2Model", [
  "FLAT_RATE",
  "PER_SEAT",
  "USAGE_BASED",
  "FLAT_RATE_USAGE_BASED",
  "ONCE",
]);
