import { relations } from "drizzle-orm";
import { funnels } from "./funnels.js";
import { stores } from "./stores.js";
import { storeProducts } from "./store-products.js";
import { funnelSteps } from "./funnel-steps.js";
import { storeOrders } from "./store-orders.js";

export const funnelsRelations = relations(funnels, (helpers) => ({
  store: helpers.one(stores, {
    relationName: "FunnelToStore",
    fields: [funnels.storeId],
    references: [stores.id],
  }),
  entryProducts: helpers.many(storeProducts, {
    relationName: "FunnelToStoreProduct",
  }),
  steps: helpers.many(funnelSteps, { relationName: "FunnelToFunnelStep" }),
  orders: helpers.many(storeOrders, { relationName: "FunnelToStoreOrder" }),
}));
