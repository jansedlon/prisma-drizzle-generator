import { relations } from "drizzle-orm";
import { invoiceV2LineItems } from "./invoice-v-2-line-items.js";
import { invoiceV2S } from "./invoice-v-2-s.js";
import { storeProducts } from "./store-products.js";

export const invoiceV2LineItemsRelations = relations(
  invoiceV2LineItems,
  (helpers) => ({
    invoice: helpers.one(invoiceV2S, {
      relationName: "InvoiceV2ToInvoiceV2LineItem",
      fields: [invoiceV2LineItems.invoiceId],
      references: [invoiceV2S.id],
    }),
    storeProduct: helpers.one(storeProducts, {
      relationName: "InvoiceV2LineItemToStoreProduct",
      fields: [invoiceV2LineItems.storeProductId],
      references: [storeProducts.id],
    }),
  }),
);
