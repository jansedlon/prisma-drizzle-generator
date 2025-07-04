import { pgEnum } from "drizzle-orm/pg-core";

export const userSaleInvoiceIssuerEnum = pgEnum("UserSaleInvoiceIssuer", [
  "FLIXY",
  "FAKTUROID",
]);
