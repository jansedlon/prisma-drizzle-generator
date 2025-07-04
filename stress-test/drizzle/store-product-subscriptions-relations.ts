import { relations } from "drizzle-orm";
import { storeProductSubscriptions } from "./store-product-subscriptions.js";
import { storeCustomers } from "./store-customers.js";
import { storeProducts } from "./store-products.js";
import { stores } from "./stores.js";
import { storeOrders } from "./store-orders.js";

export const storeProductSubscriptionsRelations = relations(
  storeProductSubscriptions,
  (helpers) => ({
    storeCustomer: helpers.one(storeCustomers, {
      relationName: "StoreCustomerToStoreProductSubscription",
      fields: [storeProductSubscriptions.storeCustomerId],
      references: [storeCustomers.id],
    }),
    product: helpers.one(storeProducts, {
      relationName: "StoreProductToStoreProductSubscription",
      fields: [storeProductSubscriptions.productId],
      references: [storeProducts.id],
    }),
    store: helpers.one(stores, {
      relationName: "StoreToStoreProductSubscription",
      fields: [storeProductSubscriptions.storeId],
      references: [stores.id],
    }),
    order: helpers.one(storeOrders, {
      relationName: "StoreOrderToStoreProductSubscription",
      fields: [storeProductSubscriptions.orderId],
      references: [storeOrders.id],
    }),
  }),
);
