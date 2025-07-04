import { relations } from "drizzle-orm";
import { userSaleInvoices } from "./user-sale-invoices.js";
import { users } from "./users.js";
import { currencies } from "./currencies.js";
import { storeOrders } from "./store-orders.js";

export const userSaleInvoicesRelations = relations(
  userSaleInvoices,
  (helpers) => ({
    user: helpers.one(users, {
      relationName: "UserToUserSaleInvoice",
      fields: [userSaleInvoices.userId],
      references: [users.id],
    }),
    currency: helpers.one(currencies, {
      relationName: "CurrencyToUserSaleInvoice",
      fields: [userSaleInvoices.currencyCode],
      references: [currencies.code],
    }),
    order: helpers.one(storeOrders, {
      relationName: "StoreOrderToUserSaleInvoice",
      fields: [userSaleInvoices.orderId],
      references: [storeOrders.id],
    }),
    correctingInvoice: helpers.one(userSaleInvoices, {
      relationName: "CorrectionInvoice",
      fields: [userSaleInvoices.correctingInvoiceId],
      references: [userSaleInvoices.id],
    }),
    correctedByInvoice: helpers.one(userSaleInvoices, {
      relationName: "CorrectionInvoice",
      fields: [userSaleInvoices.id],
      references: [userSaleInvoices.correctingInvoiceId],
    }),
  }),
);
