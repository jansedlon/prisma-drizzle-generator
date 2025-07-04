import { relations } from "drizzle-orm";
import { invoiceV2S } from "./invoice-v-2-s.js";
import { languages } from "./languages.js";
import { users } from "./users.js";
import { countries } from "./countries.js";
import { storeCustomers } from "./store-customers.js";
import { currencies } from "./currencies.js";
import { viesChecks } from "./vies-checks.js";
import { invoiceV2LineItems } from "./invoice-v-2-line-items.js";

export const invoiceV2SRelations = relations(invoiceV2S, (helpers) => ({
  language: helpers.one(languages, {
    relationName: "InvoiceV2ToLanguage",
    fields: [invoiceV2S.languageCode],
    references: [languages.ISOTwoLetterCode],
  }),
  issuerUser: helpers.one(users, {
    relationName: "IssuedInvoices",
    fields: [invoiceV2S.issuerUserId],
    references: [users.id],
  }),
  issuerCountry: helpers.one(countries, {
    relationName: "IssuerInvoices",
    fields: [invoiceV2S.issuerCountryCode],
    references: [countries.code],
  }),
  customerUser: helpers.one(users, {
    relationName: "ReceivedInvoices",
    fields: [invoiceV2S.customerUserId],
    references: [users.id],
  }),
  storeCustomer: helpers.one(storeCustomers, {
    relationName: "InvoiceV2ToStoreCustomer",
    fields: [invoiceV2S.storeCustomerId],
    references: [storeCustomers.id],
  }),
  customerCountry: helpers.one(countries, {
    relationName: "CustomerInvoices",
    fields: [invoiceV2S.customerCountryCode],
    references: [countries.code],
  }),
  currency: helpers.one(currencies, {
    relationName: "CurrencyToInvoiceV2",
    fields: [invoiceV2S.currencyCode],
    references: [currencies.code],
  }),
  ossDestinationCountry: helpers.one(countries, {
    relationName: "OSSDestinationInvoices",
    fields: [invoiceV2S.ossDestinationCountryCode],
    references: [countries.code],
  }),
  viesCheck: helpers.one(viesChecks, {
    relationName: "InvoiceV2ToViesCheck",
    fields: [invoiceV2S.viesCheckId],
    references: [viesChecks.id],
  }),
  correctedByInvoice: helpers.one(invoiceV2S, {
    relationName: "CorrectingInvoiceRelationship",
    fields: [invoiceV2S.id],
    references: [invoiceV2S.correctsInvoiceId],
  }),
  correctingInvoice: helpers.one(invoiceV2S, {
    relationName: "CorrectingInvoiceRelationship",
    fields: [invoiceV2S.correctsInvoiceId],
    references: [invoiceV2S.id],
  }),
  lineItems: helpers.many(invoiceV2LineItems, {
    relationName: "InvoiceV2ToInvoiceV2LineItem",
  }),
}));
