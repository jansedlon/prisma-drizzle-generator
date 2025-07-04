import {
  pgTable,
  text,
  integer,
  doublePrecision,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import type { InvoiceLineItemTaxMode } from "@flixydev/flixy-types/prisma";

export const invoiceLineItems = pgTable("InvoiceLineItem", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  invoiceId: text("invoiceId").notNull(),
  quantity: integer("quantity").notNull(),
  quantityUnit: text("quantityUnit").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  taxRate: integer("taxRate").notNull(),
  taxMode: text("taxMode").$type<InvoiceLineItemTaxMode>().notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
