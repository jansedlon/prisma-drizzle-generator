import { relations } from "drizzle-orm";
import { subscriptionPlans } from "./subscription-plans.js";
import { products } from "./products.js";
import { subscriptions } from "./subscriptions.js";

export const subscriptionPlansRelations = relations(
  subscriptionPlans,
  (helpers) => ({
    product: helpers.one(products, {
      relationName: "ProductToSubscriptionPlan",
      fields: [subscriptionPlans.productId],
      references: [products.id],
    }),
    subscriptions: helpers.many(subscriptions, {
      relationName: "SubscriptionToSubscriptionPlan",
    }),
    upgradedSubscriptions: helpers.many(subscriptions, {
      relationName: "UpgradedToPlan",
    }),
    downgradedSubscriptions: helpers.many(subscriptions, {
      relationName: "DowngradedToPlan",
    }),
  }),
);
