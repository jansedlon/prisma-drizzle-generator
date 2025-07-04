import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const userInvoiceLineItems = pgTable("UserInvoiceLineItem", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  invoiceId: text("invoiceId").notNull(),
  productId: text("productId").notNull(),
  lineAmount: integer("lineAmount").default(0).notNull(),
  vatAmount: integer("vatAmount").default(0).notNull(),
  vatPercentage: integer("vatPercentage").default(0).notNull(),
  unitPrice: integer("unitPrice").default(0).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
