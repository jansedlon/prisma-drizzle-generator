import { pgTable, text, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { invoiceTypeEnum } from "./invoice-type-enum.js";

export const invoices = pgTable("Invoice", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  type: invoiceTypeEnum("type").notNull(),
  languageId: text("languageId"),
  invoiceNumber: text("invoiceNumber").notNull(),
  issueDate: timestamp("issueDate", { mode: "date", precision: 3 }).notNull(),
  transactionDate: timestamp("transactionDate", { mode: "date", precision: 3 }),
  paymentDate: timestamp("paymentDate", { mode: "date", precision: 3 }),
  dueDate: timestamp("dueDate", { mode: "date", precision: 3 }),
  serviceDate: timestamp("serviceDate", { mode: "date", precision: 3 }),
  supplierVat: text("supplierVat"),
  supplierName: text("supplierName").notNull(),
  supplierEmail: text("supplierEmail"),
  supplierAddressLine1: text("supplierAddressLine1"),
  supplierAddressLine2: text("supplierAddressLine2"),
  supplierCity: text("supplierCity"),
  supplierPostalCode: text("supplierPostalCode"),
  supplierCountry: text("supplierCountry"),
  supplierLocalIdentificationNumber: text("supplierLocalIdentificationNumber"),
  foreignCurrencyRate: doublePrecision("foreignCurrencyRate"),
  customerVat: text("customerVat"),
  customerName: text("customerName").notNull(),
  customerEmail: text("customerEmail"),
  customerAddressLine1: text("customerAddressLine1"),
  customerAddressLine2: text("customerAddressLine2"),
  customerCity: text("customerCity"),
  customerPostalCode: text("customerPostalCode"),
  customerCountry: text("customerCountry"),
  customerLocalIdentificationNumber: text("customerLocalIdentificationNumber"),
  userId: text("userId"),
  totalAmount: doublePrecision("totalAmount").notNull(),
  totalTaxAmount: doublePrecision("totalTaxAmount").notNull(),
  currencyCode: text("currencyCode").notNull(),
  taxRate: doublePrecision("taxRate").notNull(),
  taxableAmount: doublePrecision("taxableAmount").notNull(),
  taxAmount: doublePrecision("taxAmount").notNull(),
  publicLocation: text("publicLocation"),
  privateLocation: text("privateLocation"),
  viesCheckId: text("viesCheckId"),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
