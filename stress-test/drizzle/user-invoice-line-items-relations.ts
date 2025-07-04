import { relations } from "drizzle-orm";
import { userInvoiceLineItems } from "./user-invoice-line-items.js";
import { userInvoices } from "./user-invoices.js";
import { products } from "./products.js";

export const userInvoiceLineItemsRelations = relations(
  userInvoiceLineItems,
  (helpers) => ({
    invoice: helpers.one(userInvoices, {
      relationName: "UserInvoiceToUserInvoiceLineItem",
      fields: [userInvoiceLineItems.invoiceId],
      references: [userInvoices.id],
    }),
    product: helpers.one(products, {
      relationName: "ProductToUserInvoiceLineItem",
      fields: [userInvoiceLineItems.productId],
      references: [products.id],
    }),
  }),
);
