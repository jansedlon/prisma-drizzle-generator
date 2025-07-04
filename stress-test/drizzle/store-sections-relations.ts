import { relations } from "drizzle-orm";
import { storeSections } from "./store-sections.js";
import { stores } from "./stores.js";

export const storeSectionsRelations = relations(storeSections, (helpers) => ({
  store: helpers.one(stores, {
    relationName: "StoreToStoreSection",
    fields: [storeSections.storeId],
    references: [stores.id],
  }),
}));
