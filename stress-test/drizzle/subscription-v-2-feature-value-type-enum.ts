import { pgEnum } from "drizzle-orm/pg-core";

export const subscriptionV2FeatureValueTypeEnum = pgEnum(
  "SubscriptionV2FeatureValueType",
  ["NUMBER", "PERCENTAGE"],
);
