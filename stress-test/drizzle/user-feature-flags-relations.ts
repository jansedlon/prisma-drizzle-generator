import { relations } from "drizzle-orm";
import { userFeatureFlags } from "./user-feature-flags.js";
import { users } from "./users.js";
import { featureFlags } from "./feature-flags.js";

export const userFeatureFlagsRelations = relations(
  userFeatureFlags,
  (helpers) => ({
    user: helpers.one(users, {
      relationName: "UserToUserFeatureFlag",
      fields: [userFeatureFlags.userId],
      references: [users.id],
    }),
    featureFlag: helpers.one(featureFlags, {
      relationName: "FeatureFlagToUserFeatureFlag",
      fields: [userFeatureFlags.featureFlagId],
      references: [featureFlags.id],
    }),
  }),
);
