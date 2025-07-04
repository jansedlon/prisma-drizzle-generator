import { relations } from "drizzle-orm";
import { productPricings } from "./product-pricings.js";
import { products } from "./products.js";
import { subscriptionV2Prices } from "./subscription-v-2-prices.js";
import { currencies } from "./currencies.js";

export const productPricingsRelations = relations(
  productPricings,
  (helpers) => ({
    product: helpers.one(products, {
      relationName: "ProductToProductPricing",
      fields: [productPricings.productId],
      references: [products.id],
    }),
    migrateToProductV2Pricing: helpers.one(subscriptionV2Prices, {
      relationName: "ProductPricingToSubscriptionV2Price",
      fields: [productPricings.migrateToProductV2PricingId],
      references: [subscriptionV2Prices.id],
    }),
    currency: helpers.one(currencies, {
      relationName: "CurrencyToProductPricing",
      fields: [productPricings.currencyCode],
      references: [currencies.code],
    }),
  }),
);
