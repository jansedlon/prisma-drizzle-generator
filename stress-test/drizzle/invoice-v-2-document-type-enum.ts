import { pgEnum } from "drizzle-orm/pg-core";

export const invoiceV2DocumentTypeEnum = pgEnum("InvoiceV2DocumentType", [
  "INVOICE",
  "CREDIT_NOTE",
  "DEBIT_NOTE",
  "PROFORMA_INVOICE",
  "ADVANCE_INVOICE",
  "CREDIT_NOTE_FOR_ADVANCE_INVOICE",
  "SIMPLIFIED_TAX_DOCUMENT",
]);
