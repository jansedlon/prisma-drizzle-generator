import { relations } from "drizzle-orm";
import { subscriptionV2Prices } from "./subscription-v-2-prices.js";
import { subscriptionV2Products } from "./subscription-v-2-products.js";
import { productPricings } from "./product-pricings.js";
import { currencies } from "./currencies.js";
import { userSubscriptionV2ProductPrices } from "./user-subscription-v-2-product-prices.js";
import { userSubscriptionProductV2S } from "./user-subscription-product-v-2-s.js";
import { appConfigurations } from "./app-configurations.js";

export const subscriptionV2PricesRelations = relations(
  subscriptionV2Prices,
  (helpers) => ({
    subscriptionProduct: helpers.one(subscriptionV2Products, {
      relationName: "SubscriptionV2PriceToSubscriptionV2Product",
      fields: [subscriptionV2Prices.subscriptionProductId],
      references: [subscriptionV2Products.id],
    }),
    migratedFromSubscriptionProduct: helpers.many(productPricings, {
      relationName: "ProductPricingToSubscriptionV2Price",
    }),
    currency: helpers.one(currencies, {
      relationName: "CurrencyToSubscriptionV2Price",
      fields: [subscriptionV2Prices.currencyCode],
      references: [currencies.code],
    }),
    userProductPrices: helpers.many(userSubscriptionV2ProductPrices, {
      relationName: "SubscriptionV2PriceToUserSubscriptionV2ProductPrice",
    }),
    downgrades: helpers.many(userSubscriptionProductV2S, {
      relationName: "SubscriptionV2PriceToUserSubscriptionProductV2",
    }),
    appConfigurationAfterSignup: helpers.one(appConfigurations),
    appConfigurationFreeSubProfitAccelerator: helpers.one(appConfigurations),
  }),
);
