import { pgEnum } from "drizzle-orm/pg-core";

export const invoiceTypeEnum = pgEnum("InvoiceType", [
  "FLIXY_FEE_INVOICE",
  "STRIPE_FEE_INVOICE",
  "TRANSFERS_INVOICE",
  "FLIXY_SUBSCRIPTION_INVOICE",
]);
