import { relations } from "drizzle-orm";
import { viesCheckOlds } from "./vies-check-olds.js";
import { invoices } from "./invoices.js";

export const viesCheckOldsRelations = relations(viesCheckOlds, (helpers) => ({
  invoices: helpers.many(invoices, { relationName: "InvoiceToViesCheckOld" }),
}));
