import { relations } from "drizzle-orm";
import { funnelSteps } from "./funnel-steps.js";
import { funnels } from "./funnels.js";
import { storeProducts } from "./store-products.js";

export const funnelStepsRelations = relations(funnelSteps, (helpers) => ({
  funnel: helpers.one(funnels, {
    relationName: "FunnelToFunnelStep",
    fields: [funnelSteps.funnelId],
    references: [funnels.id],
  }),
  product: helpers.one(storeProducts, {
    relationName: "FunnelStepToStoreProduct",
    fields: [funnelSteps.productId],
    references: [storeProducts.id],
  }),
  nextStepAccept: helpers.one(funnelSteps, {
    relationName: "FunnelStepNextStepAccept",
    fields: [funnelSteps.nextStepAcceptId],
    references: [funnelSteps.id],
  }),
  nextStepDecline: helpers.one(funnelSteps, {
    relationName: "FunnelStepNextStepDecline",
    fields: [funnelSteps.nextStepDeclineId],
    references: [funnelSteps.id],
  }),
  previousSteps1: helpers.many(funnelSteps, {
    relationName: "FunnelStepNextStepAccept",
  }),
  previousSteps2: helpers.many(funnelSteps, {
    relationName: "FunnelStepNextStepDecline",
  }),
}));
