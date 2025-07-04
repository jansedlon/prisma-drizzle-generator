import { relations } from "drizzle-orm";
import { discountCodeToStoreProducts } from "./discount-code-to-store-products.js";
import { discountCodes } from "./discount-codes.js";
import { storeProducts } from "./store-products.js";

export const discountCodeToStoreProductsRelations = relations(
  discountCodeToStoreProducts,
  (helpers) => ({
    discountCode: helpers.one(discountCodes, {
      relationName: "DiscountCodeToDiscountCodeToStoreProduct",
      fields: [discountCodeToStoreProducts.discountCodeId],
      references: [discountCodes.id],
    }),
    product: helpers.one(storeProducts, {
      relationName: "DiscountCodeToStoreProductToStoreProduct",
      fields: [discountCodeToStoreProducts.productId],
      references: [storeProducts.id],
    }),
  }),
);
