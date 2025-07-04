import { relations } from "drizzle-orm";
import { subscriptionV2UsageBasedTiers } from "./subscription-v-2-usage-based-tiers.js";
import { subscriptionV2UsageBasedPrices } from "./subscription-v-2-usage-based-prices.js";

export const subscriptionV2UsageBasedTiersRelations = relations(
  subscriptionV2UsageBasedTiers,
  (helpers) => ({
    subscriptionUsageBasedPrice: helpers.one(subscriptionV2UsageBasedPrices, {
      relationName:
        "SubscriptionV2UsageBasedPriceToSubscriptionV2UsageBasedTier",
      fields: [subscriptionV2UsageBasedTiers.subscriptionUsageBasedPriceId],
      references: [subscriptionV2UsageBasedPrices.id],
    }),
  }),
);
