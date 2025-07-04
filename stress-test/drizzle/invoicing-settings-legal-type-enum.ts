import { pgEnum } from "drizzle-orm/pg-core";

export const invoicingSettingsLegalTypeEnum = pgEnum(
  "InvoicingSettingsLegalType",
  ["SELF_EMPLOYED", "COMPANY", "NONE"],
);
