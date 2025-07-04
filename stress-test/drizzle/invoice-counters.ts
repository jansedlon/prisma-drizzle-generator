import { pgTable, text } from "drizzle-orm/pg-core";

export const invoiceCounters = pgTable("InvoiceCounter", {
  id: text("id").notNull(),
  currentNumber: text("currentNumber").notNull(),
  serialNumberPrefix: text("serialNumberPrefix").notNull(),
});
