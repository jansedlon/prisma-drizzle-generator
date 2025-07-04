import { relations } from "drizzle-orm";
import { featureFlags } from "./feature-flags.js";
import { userFeatureFlags } from "./user-feature-flags.js";

export const featureFlagsRelations = relations(featureFlags, (helpers) => ({
  userFeatureFlags: helpers.many(userFeatureFlags, {
    relationName: "FeatureFlagToUserFeatureFlag",
  }),
}));
