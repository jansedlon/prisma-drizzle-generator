import { relations } from "drizzle-orm";
import { invoiceLineItems } from "./invoice-line-items.js";
import { invoices } from "./invoices.js";

export const invoiceLineItemsRelations = relations(
  invoiceLineItems,
  (helpers) => ({
    invoice: helpers.one(invoices, {
      relationName: "InvoiceToInvoiceLineItem",
      fields: [invoiceLineItems.invoiceId],
      references: [invoices.id],
    }),
  }),
);
