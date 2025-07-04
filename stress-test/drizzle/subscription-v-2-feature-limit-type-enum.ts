import { pgEnum } from "drizzle-orm/pg-core";

export const subscriptionV2FeatureLimitTypeEnum = pgEnum(
  "SubscriptionV2FeatureLimitType",
  ["NOT_INCLUDED", "INCLUDED", "MONTHLY", "MAX", "UNLIMITED", "FIXED"],
);
