import { relations } from "drizzle-orm";
import { subscriptions } from "./subscriptions.js";
import { users } from "./users.js";
import { subscriptionPlans } from "./subscription-plans.js";
import { userInvoices } from "./user-invoices.js";

export const subscriptionsRelations = relations(subscriptions, (helpers) => ({
  user: helpers.one(users, {
    relationName: "SubscriptionToUser",
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  plan: helpers.one(subscriptionPlans, {
    relationName: "SubscriptionToSubscriptionPlan",
    fields: [subscriptions.planId],
    references: [subscriptionPlans.id],
  }),
  invoices: helpers.many(userInvoices, {
    relationName: "SubscriptionToUserInvoice",
  }),
  renewedSubscription: helpers.one(subscriptions, {
    relationName: "SubscriptionHistory",
    fields: [subscriptions.renewedSubscriptionId],
    references: [subscriptions.id],
  }),
  previousSubscription: helpers.one(subscriptions, {
    relationName: "SubscriptionHistory",
    fields: [subscriptions.id],
    references: [subscriptions.renewedSubscriptionId],
  }),
  downgradedToPlan: helpers.one(subscriptionPlans, {
    relationName: "DowngradedToPlan",
    fields: [subscriptions.downgradedToPlanId],
    references: [subscriptionPlans.id],
  }),
  upgradedToPlan: helpers.one(subscriptionPlans, {
    relationName: "UpgradedToPlan",
    fields: [subscriptions.upgradedToPlanId],
    references: [subscriptionPlans.id],
  }),
}));
