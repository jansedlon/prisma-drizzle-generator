import { pgEnum } from "drizzle-orm/pg-core";

export const invoiceV2PaymentStatusEnum = pgEnum("InvoiceV2PaymentStatus", [
  "UNPAID",
  "PAID",
  "PARTIALLY_PAID",
  "OVERDUE",
  "REFUNDED",
]);
