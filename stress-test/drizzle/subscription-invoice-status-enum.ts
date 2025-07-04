import { pgEnum } from "drizzle-orm/pg-core";

export const subscriptionInvoiceStatusEnum = pgEnum(
  "SubscriptionInvoiceStatus",
  ["DRAFT", "UNPAID", "PAID"],
);
