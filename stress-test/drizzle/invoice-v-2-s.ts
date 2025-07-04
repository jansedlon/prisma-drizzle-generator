import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  doublePrecision,
  jsonb,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { invoiceV2TypeEnum } from "./invoice-v-2-type-enum.js";
import { invoiceV2DocumentTypeEnum } from "./invoice-v-2-document-type-enum.js";
import { invoiceV2LifecycleStatusEnum } from "./invoice-v-2-lifecycle-status-enum.js";
import { invoiceV2PaymentStatusEnum } from "./invoice-v-2-payment-status-enum.js";
import { issuerTypeEnum } from "./issuer-type-enum.js";
import type {
  InvoiceV2TaxSummary,
  InvoiceV2ExternalInvoiceProvider,
  InvoiceV2ExternalInvoiceData,
  InvoiceV2TemplateOverrideData,
} from "@flixydev/flixy-types/prisma";
import { taxSchemeEnum } from "./tax-scheme-enum.js";
import { sourceEntityTypeEnum } from "./source-entity-type-enum.js";

export const invoiceV2S = pgTable("InvoiceV2", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  uuid: text("uuid").notNull(),
  invoiceNumber: text("invoiceNumber").notNull(),
  type: invoiceV2TypeEnum("type").notNull(),
  documentType: invoiceV2DocumentTypeEnum("documentType").notNull(),
  status: invoiceV2LifecycleStatusEnum("status").default("DRAFT").notNull(),
  paymentStatus: invoiceV2PaymentStatusEnum("paymentStatus")
    .default("UNPAID")
    .notNull(),
  languageCode: text("languageCode").notNull(),
  issueDate: timestamp("issueDate", { mode: "date", precision: 3 }).notNull(),
  dueDate: timestamp("dueDate", { mode: "date", precision: 3 }),
  paymentDate: timestamp("paymentDate", { mode: "date", precision: 3 }),
  taxPointDate: timestamp("taxPointDate", { mode: "date", precision: 3 }),
  issuerType: issuerTypeEnum("issuerType").notNull(),
  issuerUserId: text("issuerUserId"),
  issuerExternalName: text("issuerExternalName"),
  issuerName: text("issuerName").notNull(),
  issuerEmail: text("issuerEmail").notNull(),
  issuerAddressLine1: text("issuerAddressLine1"),
  issuerAddressLine2: text("issuerAddressLine2"),
  issuerCity: text("issuerCity"),
  issuerPostalCode: text("issuerPostalCode"),
  issuerCountryCode: text("issuerCountryCode"),
  issuerVatId: text("issuerVatId"),
  issuerRegistrationNumber: text("issuerRegistrationNumber"),
  issuerPhoneNumber: text("issuerPhoneNumber"),
  issuerBankName: text("issuerBankName"),
  issuerBankAccountNumber: text("issuerBankAccountNumber"),
  issuerBankIban: text("issuerBankIban"),
  issuerBankSwift: text("issuerBankSwift"),
  issuerIsVatPayerAtIssueTime: boolean("issuerIsVatPayerAtIssueTime").notNull(),
  issuerVatExemptionReasonAtIssue: text("issuerVatExemptionReasonAtIssue"),
  customerUserId: text("customerUserId"),
  storeCustomerId: text("storeCustomerId"),
  customerName: text("customerName").notNull(),
  customerEmail: text("customerEmail").notNull(),
  customerAddressLine1: text("customerAddressLine1"),
  customerAddressLine2: text("customerAddressLine2"),
  customerCity: text("customerCity"),
  customerPostalCode: text("customerPostalCode"),
  customerCountryCode: text("customerCountryCode"),
  customerVatId: text("customerVatId"),
  customerRegistrationNumber: text("customerRegistrationNumber"),
  customerIsBusinessAtIssueTime: boolean(
    "customerIsBusinessAtIssueTime",
  ).notNull(),
  currencyCode: text("currencyCode").notNull(),
  totalNetAmount: integer("totalNetAmount").notNull(),
  totalTaxAmount: integer("totalTaxAmount").notNull(),
  totalAmount: integer("totalAmount").notNull(),
  exchangeRateToBaseCurrency: doublePrecision("exchangeRateToBaseCurrency"),
  baseCurrencyCode: text("baseCurrencyCode"),
  taxSummary: jsonb("taxSummary")
    .array()
    .$type<InvoiceV2TaxSummary>()
    .notNull(),
  taxScheme: taxSchemeEnum("taxScheme").default("DOMESTIC").notNull(),
  ossDestinationCountryCode: text("ossDestinationCountryCode"),
  viesCheckId: text("viesCheckId"),
  sourceEntityType: sourceEntityTypeEnum("sourceEntityType"),
  sourceEntityId: text("sourceEntityId"),
  correctsInvoiceId: text("correctsInvoiceId"),
  correctionReason: text("correctionReason"),
  pdfGeneratedUrl: text("pdfGeneratedUrl"),
  isdocGeneratedUrl: text("isdocGeneratedUrl"),
  externalInvoiceProvider: text(
    "externalInvoiceProvider",
  ).$type<InvoiceV2ExternalInvoiceProvider>(),
  externalInvoiceId: text("externalInvoiceId"),
  externalInvoiceData: jsonb(
    "externalInvoiceData",
  ).$type<InvoiceV2ExternalInvoiceData>(),
  paymentGatewayTransactionId: text("paymentGatewayTransactionId"),
  internalNotes: text("internalNotes"),
  createdBySource: text("createdBySource"),
  initatedByUserId: text("initatedByUserId"),
  templateOverrideData: jsonb(
    "templateOverrideData",
  ).$type<InvoiceV2TemplateOverrideData>(),
  footerNote: text("footerNote"),
  taxNotes: text("taxNotes").array().default([]).notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .$onUpdateFn(() => new Date())
    .notNull(),
});
