import { relations } from "drizzle-orm";
import { productLocalizations } from "./product-localizations.js";
import { languages } from "./languages.js";
import { products } from "./products.js";

export const productLocalizationsRelations = relations(
  productLocalizations,
  (helpers) => ({
    language: helpers.one(languages, {
      relationName: "LanguageToProductLocalization",
      fields: [productLocalizations.languageId],
      references: [languages.id],
    }),
    product: helpers.one(products, {
      relationName: "ProductToProductLocalization",
      fields: [productLocalizations.productId],
      references: [products.id],
    }),
  }),
);
