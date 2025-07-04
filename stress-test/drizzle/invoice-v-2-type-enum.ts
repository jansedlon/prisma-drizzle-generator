import { pgEnum } from "drizzle-orm/pg-core";

export const invoiceV2TypeEnum = pgEnum("InvoiceV2Type", [
  "FLIXY_PRODUCT_PURCHASE",
  "FLIXY_SUBSCRIPTION",
  "FLIXY_PLATFORM_FEE",
  "STRIPE_TRANSACTION_FEE",
  "USER_REFERRAL_PAYOUT",
  "STORE_SALE",
  "STORE_REFUND",
  "MANUAL",
]);
