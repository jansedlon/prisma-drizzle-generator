import { relations } from "drizzle-orm";
import { stores } from "./stores.js";
import { storeThemes } from "./store-themes.js";
import { courses } from "./courses.js";
import { storeToUsers } from "./store-to-users.js";
import { storePages } from "./store-pages.js";
import { storeOrders } from "./store-orders.js";
import { storeCustomers } from "./store-customers.js";
import { storeSections } from "./store-sections.js";
import { storeProductSubscriptions } from "./store-product-subscriptions.js";
import { communities } from "./communities.js";
import { transactionsReports } from "./transactions-reports.js";
import { funnels } from "./funnels.js";
import { discountCodes } from "./discount-codes.js";
import { storePageUrgencies } from "./store-page-urgencies.js";
import { appConfigurations } from "./app-configurations.js";

export const storesRelations = relations(stores, (helpers) => ({
  theme: helpers.one(storeThemes, {
    relationName: "StoreToStoreTheme",
    fields: [stores.themeId],
    references: [storeThemes.id],
  }),
  courses: helpers.many(courses, { relationName: "CourseToStore" }),
  storeUsers: helpers.many(storeToUsers, {
    relationName: "StoreToStoreToUser",
  }),
  pages: helpers.many(storePages, { relationName: "StoreToStorePage" }),
  orders: helpers.many(storeOrders, { relationName: "StoreToStoreOrder" }),
  customers: helpers.many(storeCustomers, {
    relationName: "StoreToStoreCustomer",
  }),
  sections: helpers.many(storeSections, {
    relationName: "StoreToStoreSection",
  }),
  fanSubscriptions: helpers.many(storeProductSubscriptions, {
    relationName: "StoreToStoreProductSubscription",
  }),
  communities: helpers.many(communities, { relationName: "CommunityToStore" }),
  transactionReports: helpers.many(transactionsReports, {
    relationName: "StoreToTransactionsReport",
  }),
  funnels: helpers.many(funnels, { relationName: "FunnelToStore" }),
  discountCodes: helpers.many(discountCodes, {
    relationName: "DiscountCodeToStore",
  }),
  storePageUrgency: helpers.many(storePageUrgencies, {
    relationName: "StoreToStorePageUrgency",
  }),
  flixyStoreConfiguration: helpers.one(appConfigurations),
}));
