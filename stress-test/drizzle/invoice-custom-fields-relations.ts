import { relations } from "drizzle-orm";
import { invoiceCustomFields } from "./invoice-custom-fields.js";
import { invoices } from "./invoices.js";

export const invoiceCustomFieldsRelations = relations(
  invoiceCustomFields,
  (helpers) => ({
    invoice: helpers.one(invoices, {
      relationName: "InvoiceToInvoiceCustomField",
      fields: [invoiceCustomFields.invoiceId],
      references: [invoices.id],
    }),
  }),
);
