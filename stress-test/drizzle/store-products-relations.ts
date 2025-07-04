import { relations } from "drizzle-orm";
import { storeProducts } from "./store-products.js";
import { storePages } from "./store-pages.js";
import { meetings } from "./meetings.js";
import { storeProductPrices } from "./store-product-prices.js";
import { storeProductUpSells } from "./store-product-up-sells.js";
import { storeProductSubscriptions } from "./store-product-subscriptions.js";
import { courses } from "./courses.js";
import { funnelSteps } from "./funnel-steps.js";
import { funnels } from "./funnels.js";
import { discountCodeToStoreProducts } from "./discount-code-to-store-products.js";
import { courseToCommunities } from "./course-to-communities.js";
import { invoiceV2LineItems } from "./invoice-v-2-line-items.js";

export const storeProductsRelations = relations(storeProducts, (helpers) => ({
  page: helpers.one(storePages, {
    relationName: "StorePageToStoreProduct",
    fields: [storeProducts.pageId],
    references: [storePages.id],
  }),
  meeting: helpers.one(meetings),
  price: helpers.one(storeProductPrices),
  upSells: helpers.many(storeProductUpSells, {
    relationName: "StoreProductToStoreProductUpSell",
  }),
  subscriptions: helpers.many(storeProductSubscriptions, {
    relationName: "StoreProductToStoreProductSubscription",
  }),
  courses: helpers.many(courses, { relationName: "CourseToStoreProduct" }),
  funnelStep: helpers.one(funnelSteps),
  connectedFunnel: helpers.one(funnels, {
    relationName: "FunnelToStoreProduct",
    fields: [storeProducts.connectedFunnelId],
    references: [funnels.id],
  }),
  discountCodes: helpers.many(discountCodeToStoreProducts, {
    relationName: "DiscountCodeToStoreProductToStoreProduct",
  }),
  courseToCommunity: helpers.one(courseToCommunities),
  invoicesProductAppearOn: helpers.many(invoiceV2LineItems, {
    relationName: "InvoiceV2LineItemToStoreProduct",
  }),
}));
