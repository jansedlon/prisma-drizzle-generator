import { relations } from "drizzle-orm";
import { viesChecks } from "./vies-checks.js";
import { invoiceV2S } from "./invoice-v-2-s.js";

export const viesChecksRelations = relations(viesChecks, (helpers) => ({
  invoices: helpers.many(invoiceV2S, { relationName: "InvoiceV2ToViesCheck" }),
}));
