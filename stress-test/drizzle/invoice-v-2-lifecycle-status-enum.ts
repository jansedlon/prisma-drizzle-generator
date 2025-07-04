import { pgEnum } from "drizzle-orm/pg-core";

export const invoiceV2LifecycleStatusEnum = pgEnum("InvoiceV2LifecycleStatus", [
  "DRAFT",
  "PENDING_ISSUE",
  "ISSUED",
  "VOIDED",
  "CORRECTED",
]);
