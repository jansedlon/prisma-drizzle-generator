import { relations } from "drizzle-orm";
import { storeProductUpSells } from "./store-product-up-sells.js";
import { storeProducts } from "./store-products.js";

export const storeProductUpSellsRelations = relations(
  storeProductUpSells,
  (helpers) => ({
    product: helpers.one(storeProducts, {
      relationName: "StoreProductToStoreProductUpSell",
      fields: [storeProductUpSells.productId],
      references: [storeProducts.id],
    }),
  }),
);
