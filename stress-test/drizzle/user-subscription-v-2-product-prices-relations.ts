import { relations } from "drizzle-orm";
import { userSubscriptionV2ProductPrices } from "./user-subscription-v-2-product-prices.js";
import { userSubscriptionProductV2S } from "./user-subscription-product-v-2-s.js";
import { subscriptionV2Prices } from "./subscription-v-2-prices.js";
import { subscriptionV2UsageBasedPrices } from "./subscription-v-2-usage-based-prices.js";
import { userSubscriptionV2UsageRecords } from "./user-subscription-v-2-usage-records.js";

export const userSubscriptionV2ProductPricesRelations = relations(
  userSubscriptionV2ProductPrices,
  (helpers) => ({
    userSubscriptionProduct: helpers.one(userSubscriptionProductV2S, {
      relationName: "UserSubscriptionProductV2ToUserSubscriptionV2ProductPrice",
      fields: [userSubscriptionV2ProductPrices.userSubscriptionProductId],
      references: [userSubscriptionProductV2S.id],
    }),
    price: helpers.one(subscriptionV2Prices, {
      relationName: "SubscriptionV2PriceToUserSubscriptionV2ProductPrice",
      fields: [userSubscriptionV2ProductPrices.priceId],
      references: [subscriptionV2Prices.id],
    }),
    subscriptionUsageBasedPrice: helpers.one(subscriptionV2UsageBasedPrices, {
      relationName:
        "SubscriptionV2UsageBasedPriceToUserSubscriptionV2ProductPrice",
      fields: [userSubscriptionV2ProductPrices.subscriptionUsageBasedPriceId],
      references: [subscriptionV2UsageBasedPrices.id],
    }),
    usageRecords: helpers.many(userSubscriptionV2UsageRecords, {
      relationName:
        "UserSubscriptionV2ProductPriceToUserSubscriptionV2UsageRecord",
    }),
  }),
);
