import { relations } from "drizzle-orm";
import { products } from "./products.js";
import { productPricings } from "./product-pricings.js";
import { subscriptionV2Products } from "./subscription-v-2-products.js";
import { productLocalizations } from "./product-localizations.js";
import { subscriptionPlans } from "./subscription-plans.js";
import { userInvoiceLineItems } from "./user-invoice-line-items.js";

export const productsRelations = relations(products, (helpers) => ({
  pricings: helpers.many(productPricings, {
    relationName: "ProductToProductPricing",
  }),
  migrateToProduct: helpers.one(subscriptionV2Products, {
    relationName: "ProductToSubscriptionV2Product",
    fields: [products.migrateToProductId],
    references: [subscriptionV2Products.id],
  }),
  translations: helpers.many(productLocalizations, {
    relationName: "ProductToProductLocalization",
  }),
  subscriptionPlans: helpers.many(subscriptionPlans, {
    relationName: "ProductToSubscriptionPlan",
  }),
  subscriptionInvoiceLineItems: helpers.many(userInvoiceLineItems, {
    relationName: "ProductToUserInvoiceLineItem",
  }),
}));
