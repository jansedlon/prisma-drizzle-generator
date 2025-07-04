import { relations } from "drizzle-orm";
import { userSubscriptionProductV2S } from "./user-subscription-product-v-2-s.js";
import { subscriptionV2Prices } from "./subscription-v-2-prices.js";
import { userInvoices } from "./user-invoices.js";
import { users } from "./users.js";
import { subscriptionV2Products } from "./subscription-v-2-products.js";
import { userSubscriptionV2ProductPrices } from "./user-subscription-v-2-product-prices.js";

export const userSubscriptionProductV2SRelations = relations(
  userSubscriptionProductV2S,
  (helpers) => ({
    downgradeToPrice: helpers.one(subscriptionV2Prices, {
      relationName: "SubscriptionV2PriceToUserSubscriptionProductV2",
      fields: [userSubscriptionProductV2S.downgradeToPriceId],
      references: [subscriptionV2Prices.id],
    }),
    invoices: helpers.many(userInvoices, {
      relationName: "UserInvoiceToUserSubscriptionProductV2",
    }),
    user: helpers.one(users, {
      relationName: "UserToUserSubscriptionProductV2",
      fields: [userSubscriptionProductV2S.userId],
      references: [users.id],
    }),
    subscriptionProduct: helpers.one(subscriptionV2Products, {
      relationName: "SubscriptionV2ProductToUserSubscriptionProductV2",
      fields: [userSubscriptionProductV2S.subscriptionProductId],
      references: [subscriptionV2Products.id],
    }),
    prices: helpers.many(userSubscriptionV2ProductPrices, {
      relationName: "UserSubscriptionProductV2ToUserSubscriptionV2ProductPrice",
    }),
  }),
);
