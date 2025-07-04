import { relations } from "drizzle-orm";
import { storeOrders } from "./store-orders.js";
import { stores } from "./stores.js";
import { storePages } from "./store-pages.js";
import { currencies } from "./currencies.js";
import { storeCustomers } from "./store-customers.js";
import { userSaleInvoices } from "./user-sale-invoices.js";
import { storeProductSubscriptions } from "./store-product-subscriptions.js";
import { funnels } from "./funnels.js";

export const storeOrdersRelations = relations(storeOrders, (helpers) => ({
  store: helpers.one(stores, {
    relationName: "StoreToStoreOrder",
    fields: [storeOrders.storeId],
    references: [stores.id],
  }),
  page: helpers.one(storePages, {
    relationName: "StoreOrderToStorePage",
    fields: [storeOrders.pageId],
    references: [storePages.id],
  }),
  currency: helpers.one(currencies, {
    relationName: "CurrencyToStoreOrder",
    fields: [storeOrders.currencyCode],
    references: [currencies.code],
  }),
  storeCustomer: helpers.one(storeCustomers, {
    relationName: "StoreCustomerToStoreOrder",
    fields: [storeOrders.storeCustomerId],
    references: [storeCustomers.id],
  }),
  invoices: helpers.many(userSaleInvoices, {
    relationName: "StoreOrderToUserSaleInvoice",
  }),
  subscription: helpers.one(storeProductSubscriptions),
  funnel: helpers.one(funnels, {
    relationName: "FunnelToStoreOrder",
    fields: [storeOrders.funnelId],
    references: [funnels.id],
  }),
}));
