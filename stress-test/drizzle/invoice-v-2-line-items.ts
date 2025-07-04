import { pgTable, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { taxClassificationEnum } from "./tax-classification-enum.js";
import { taxSchemeEnum } from "./tax-scheme-enum.js";
import type { InvoiceV2LineItemMetadata } from "@flixydev/flixy-types/prisma";

export const invoiceV2LineItems = pgTable("InvoiceV2LineItem", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  invoiceId: text("invoiceId").notNull(),
  description: text("description").notNull(),
  storeProductId: text("storeProductId"),
  productSku: text("productSku"),
  quantity: integer("quantity").notNull(),
  unit: text("unit"),
  unitPriceNetAmount: integer("unitPriceNetAmount").notNull(),
  unitPriceGrossAmount: integer("unitPriceGrossAmount").notNull(),
  unitPriceTaxAmount: integer("unitPriceTaxAmount").notNull(),
  totalNetAmount: integer("totalNetAmount").notNull(),
  totalTaxAmount: integer("totalTaxAmount").notNull(),
  totalGrossAmount: integer("totalGrossAmount").notNull(),
  taxRatePercentage: integer("taxRatePercentage").notNull(),
  taxClassification: taxClassificationEnum("taxClassification")
    .default("STANDARD")
    .notNull(),
  lineItemTaxScheme: taxSchemeEnum("lineItemTaxScheme"),
  sortOrder: integer("sortOrder").default(0).notNull(),
  metadata: jsonb("metadata").$type<InvoiceV2LineItemMetadata>(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .$onUpdateFn(() => new Date())
    .notNull(),
});
