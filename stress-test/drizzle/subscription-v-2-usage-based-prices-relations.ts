import { relations } from "drizzle-orm";
import { subscriptionV2UsageBasedPrices } from "./subscription-v-2-usage-based-prices.js";
import { subscriptionV2UsageBasedTiers } from "./subscription-v-2-usage-based-tiers.js";
import { userSubscriptionV2ProductPrices } from "./user-subscription-v-2-product-prices.js";
import { subscriptionV2Products } from "./subscription-v-2-products.js";
import { currencies } from "./currencies.js";

export const subscriptionV2UsageBasedPricesRelations = relations(
  subscriptionV2UsageBasedPrices,
  (helpers) => ({
    tiers: helpers.many(subscriptionV2UsageBasedTiers, {
      relationName:
        "SubscriptionV2UsageBasedPriceToSubscriptionV2UsageBasedTier",
    }),
    userProductPrices: helpers.many(userSubscriptionV2ProductPrices, {
      relationName:
        "SubscriptionV2UsageBasedPriceToUserSubscriptionV2ProductPrice",
    }),
    subscriptionProduct: helpers.one(subscriptionV2Products, {
      relationName: "SubscriptionV2ProductToSubscriptionV2UsageBasedPrice",
      fields: [subscriptionV2UsageBasedPrices.subscriptionProductId],
      references: [subscriptionV2Products.id],
    }),
    currency: helpers.one(currencies, {
      relationName: "CurrencyToSubscriptionV2UsageBasedPrice",
      fields: [subscriptionV2UsageBasedPrices.currencyCode],
      references: [currencies.code],
    }),
  }),
);
