import { relations } from "drizzle-orm";
import { subscriptionV2Products } from "./subscription-v-2-products.js";
import { products } from "./products.js";
import { subscriptionV2Prices } from "./subscription-v-2-prices.js";
import { subscriptionV2Features } from "./subscription-v-2-features.js";
import { subscriptionV2UsageBasedPrices } from "./subscription-v-2-usage-based-prices.js";
import { userSubscriptionProductV2S } from "./user-subscription-product-v-2-s.js";
import { appConfigurations } from "./app-configurations.js";

export const subscriptionV2ProductsRelations = relations(
  subscriptionV2Products,
  (helpers) => ({
    migrationFromLegacyProducts: helpers.many(products, {
      relationName: "ProductToSubscriptionV2Product",
    }),
    prices: helpers.many(subscriptionV2Prices, {
      relationName: "SubscriptionV2PriceToSubscriptionV2Product",
    }),
    features: helpers.many(subscriptionV2Features, {
      relationName: "SubscriptionV2FeatureToSubscriptionV2Product",
    }),
    usageBasedPrices: helpers.many(subscriptionV2UsageBasedPrices, {
      relationName: "SubscriptionV2ProductToSubscriptionV2UsageBasedPrice",
    }),
    userSubscriptionProducts: helpers.many(userSubscriptionProductV2S, {
      relationName: "SubscriptionV2ProductToUserSubscriptionProductV2",
    }),
    appConfiguration: helpers.one(appConfigurations),
  }),
);
