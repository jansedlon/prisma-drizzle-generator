import { relations } from "drizzle-orm";
import { storePages } from "./store-pages.js";
import { stores } from "./stores.js";
import { storeProducts } from "./store-products.js";
import { storeOrders } from "./store-orders.js";
import { storePageUrgencies } from "./store-page-urgencies.js";

export const storePagesRelations = relations(storePages, (helpers) => ({
  store: helpers.one(stores, {
    relationName: "StoreToStorePage",
    fields: [storePages.storeId],
    references: [stores.id],
  }),
  product: helpers.one(storeProducts),
  orders: helpers.many(storeOrders, { relationName: "StoreOrderToStorePage" }),
  storePageUrgency: helpers.many(storePageUrgencies, {
    relationName: "StorePageToStorePageUrgency",
  }),
}));
