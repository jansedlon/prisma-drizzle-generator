import { relations } from "drizzle-orm";
import { storePageUrgencies } from "./store-page-urgencies.js";
import { storePages } from "./store-pages.js";
import { stores } from "./stores.js";

export const storePageUrgenciesRelations = relations(
  storePageUrgencies,
  (helpers) => ({
    storePage: helpers.one(storePages, {
      relationName: "StorePageToStorePageUrgency",
      fields: [storePageUrgencies.storePageId],
      references: [storePages.id],
    }),
    store: helpers.one(stores, {
      relationName: "StoreToStorePageUrgency",
      fields: [storePageUrgencies.storeId],
      references: [stores.id],
    }),
  }),
);
