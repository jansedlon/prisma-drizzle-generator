import { relations } from "drizzle-orm";
import { subscriptionV2Features } from "./subscription-v-2-features.js";
import { subscriptionV2Products } from "./subscription-v-2-products.js";

export const subscriptionV2FeaturesRelations = relations(
  subscriptionV2Features,
  (helpers) => ({
    subscriptionProduct: helpers.one(subscriptionV2Products, {
      relationName: "SubscriptionV2FeatureToSubscriptionV2Product",
      fields: [subscriptionV2Features.subscriptionProductId],
      references: [subscriptionV2Products.id],
    }),
  }),
);
