import { pgTable, text } from "drizzle-orm/pg-core";

export const userSaleInvoiceCounters = pgTable("UserSaleInvoiceCounter", {
  userId: text("userId").notNull(),
  currentNumber: text("currentNumber").notNull(),
  serialNumberPrefix: text("serialNumberPrefix").default("FL").notNull(),
});
