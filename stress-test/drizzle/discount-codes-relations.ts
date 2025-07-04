import { relations } from "drizzle-orm";
import { discountCodes } from "./discount-codes.js";
import { currencies } from "./currencies.js";
import { discountCodeToStoreProducts } from "./discount-code-to-store-products.js";
import { stores } from "./stores.js";

export const discountCodesRelations = relations(discountCodes, (helpers) => ({
  currency: helpers.one(currencies, {
    relationName: "CurrencyToDiscountCode",
    fields: [discountCodes.currencyCode],
    references: [currencies.code],
  }),
  codeToProducts: helpers.many(discountCodeToStoreProducts, {
    relationName: "DiscountCodeToDiscountCodeToStoreProduct",
  }),
  store: helpers.one(stores, {
    relationName: "DiscountCodeToStore",
    fields: [discountCodes.storeId],
    references: [stores.id],
  }),
}));
