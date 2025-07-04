import { relations } from "drizzle-orm";
import { invoices } from "./invoices.js";
import { languages } from "./languages.js";
import { users } from "./users.js";
import { currencies } from "./currencies.js";
import { invoiceLineItems } from "./invoice-line-items.js";
import { invoiceCustomFields } from "./invoice-custom-fields.js";
import { viesCheckOlds } from "./vies-check-olds.js";

export const invoicesRelations = relations(invoices, (helpers) => ({
  language: helpers.one(languages, {
    relationName: "InvoiceToLanguage",
    fields: [invoices.languageId],
    references: [languages.id],
  }),
  user: helpers.one(users, {
    relationName: "InvoiceToUser",
    fields: [invoices.userId],
    references: [users.id],
  }),
  currency: helpers.one(currencies, {
    relationName: "CurrencyToInvoice",
    fields: [invoices.currencyCode],
    references: [currencies.code],
  }),
  lineItems: helpers.many(invoiceLineItems, {
    relationName: "InvoiceToInvoiceLineItem",
  }),
  customFields: helpers.many(invoiceCustomFields, {
    relationName: "InvoiceToInvoiceCustomField",
  }),
  viesCheck: helpers.one(viesCheckOlds, {
    relationName: "InvoiceToViesCheckOld",
    fields: [invoices.viesCheckId],
    references: [viesCheckOlds.id],
  }),
}));
