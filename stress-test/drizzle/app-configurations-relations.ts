import { relations } from "drizzle-orm";
import { appConfigurations } from "./app-configurations.js";
import { subscriptionV2Prices } from "./subscription-v-2-prices.js";
import { stores } from "./stores.js";
import { communities } from "./communities.js";
import { subscriptionV2Products } from "./subscription-v-2-products.js";

export const appConfigurationsRelations = relations(
  appConfigurations,
  (helpers) => ({
    afterSignupSubscriptionPrice: helpers.one(subscriptionV2Prices, {
      relationName: "afterSignupSubscriptionPrice",
      fields: [appConfigurations.afterSignupSubscriptionPriceId],
      references: [subscriptionV2Prices.id],
    }),
    flixyStore: helpers.one(stores, {
      relationName: "AppConfigurationToStore",
      fields: [appConfigurations.flixyStoreId],
      references: [stores.id],
    }),
    profitAcceleratorCommunity: helpers.one(communities, {
      relationName: "AppConfigurationToCommunity",
      fields: [appConfigurations.profitAcceleratorCommunityId],
      references: [communities.id],
    }),
    profitAcceleratorProBetaProduct: helpers.one(subscriptionV2Products, {
      relationName: "AppConfigurationToSubscriptionV2Product",
      fields: [appConfigurations.profitAcceleratorProBetaProductId],
      references: [subscriptionV2Products.id],
    }),
    profitAcceleratorFreeSubscriptionPrice: helpers.one(subscriptionV2Prices, {
      relationName: "profitAcceleratorFreeSubscriptionPrice",
      fields: [appConfigurations.profitAcceleratorFreeSubscriptionPriceId],
      references: [subscriptionV2Prices.id],
    }),
  }),
);
