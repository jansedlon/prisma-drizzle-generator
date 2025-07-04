import { relations } from "drizzle-orm";
import { storeProductPrices } from "./store-product-prices.js";
import { storeProducts } from "./store-products.js";
import { currencies } from "./currencies.js";

export const storeProductPricesRelations = relations(
  storeProductPrices,
  (helpers) => ({
    product: helpers.one(storeProducts, {
      relationName: "StoreProductToStoreProductPrice",
      fields: [storeProductPrices.productId],
      references: [storeProducts.id],
    }),
    currency: helpers.one(currencies, {
      relationName: "CurrencyToStoreProductPrice",
      fields: [storeProductPrices.currencyCode],
      references: [currencies.code],
    }),
  }),
);
