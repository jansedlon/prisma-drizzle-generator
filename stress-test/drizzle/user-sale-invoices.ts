import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { userSaleInvoiceIssuerEnum } from "./user-sale-invoice-issuer-enum.js";
import type { UserSaleInvoiceStatus } from "@flixydev/flixy-types/prisma";

export const userSaleInvoices = pgTable("UserSaleInvoice", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  issuerId: text("issuerId"),
  userId: text("userId").notNull(),
  invoiceNumber: text("invoiceNumber"),
  currencyCode: text("currencyCode").notNull(),
  orderId: text("orderId"),
  amount: integer("amount").notNull(),
  issuer: userSaleInvoiceIssuerEnum("issuer").default("FLIXY").notNull(),
  customerCountry: text("customerCountry"),
  status: text("status").$type<UserSaleInvoiceStatus>().notNull(),
  correctionReason: text("correctionReason"),
  correctingInvoiceId: text("correctingInvoiceId"),
  location: text("location"),
  stripePaymentIntentId: text("stripePaymentIntentId"),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
