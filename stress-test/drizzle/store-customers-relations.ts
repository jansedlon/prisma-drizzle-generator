import { relations } from "drizzle-orm";
import { storeCustomers } from "./store-customers.js";
import { stores } from "./stores.js";
import { users } from "./users.js";
import { customers } from "./customers.js";
import { storeOrders } from "./store-orders.js";
import { storeProductSubscriptions } from "./store-product-subscriptions.js";
import { countries } from "./countries.js";
import { invoiceV2S } from "./invoice-v-2-s.js";

export const storeCustomersRelations = relations(storeCustomers, (helpers) => ({
  store: helpers.one(stores, {
    relationName: "StoreToStoreCustomer",
    fields: [storeCustomers.storeId],
    references: [stores.id],
  }),
  user: helpers.one(users, {
    relationName: "StoreCustomerToUser",
    fields: [storeCustomers.userId],
    references: [users.id],
  }),
  customer: helpers.one(customers, {
    relationName: "CustomerToStoreCustomer",
    fields: [storeCustomers.customerId],
    references: [customers.id],
  }),
  orders: helpers.many(storeOrders, {
    relationName: "StoreCustomerToStoreOrder",
  }),
  subscriptions: helpers.many(storeProductSubscriptions, {
    relationName: "StoreCustomerToStoreProductSubscription",
  }),
  country: helpers.one(countries, {
    relationName: "CountryToStoreCustomer",
    fields: [storeCustomers.countryCode],
    references: [countries.code],
  }),
  invoicesV2: helpers.many(invoiceV2S, {
    relationName: "InvoiceV2ToStoreCustomer",
  }),
}));
