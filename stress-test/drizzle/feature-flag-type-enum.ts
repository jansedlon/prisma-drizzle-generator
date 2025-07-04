import { pgEnum } from "drizzle-orm/pg-core";

export const featureFlagTypeEnum = pgEnum("FeatureFlagType", [
  "USER_APPROVED",
  "PERCENTAGE_ROLLOUT",
]);
