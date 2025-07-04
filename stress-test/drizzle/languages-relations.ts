import { relations } from "drizzle-orm";
import { languages } from "./languages.js";
import { users } from "./users.js";
import { currencyLocalizations } from "./currency-localizations.js";
import { productLocalizations } from "./product-localizations.js";
import { storeThemeTranslations } from "./store-theme-translations.js";
import { invoices } from "./invoices.js";
import { invoiceV2S } from "./invoice-v-2-s.js";

export const languagesRelations = relations(languages, (helpers) => ({
  users: helpers.many(users, { relationName: "LanguageToUser" }),
  currencyTranslations: helpers.many(currencyLocalizations, {
    relationName: "CurrencyLocalizationToLanguage",
  }),
  productTranslations: helpers.many(productLocalizations, {
    relationName: "LanguageToProductLocalization",
  }),
  storeThemeTranslations: helpers.many(storeThemeTranslations, {
    relationName: "LanguageToStoreThemeTranslations",
  }),
  invoices: helpers.many(invoices, { relationName: "InvoiceToLanguage" }),
  invoicesV2: helpers.many(invoiceV2S, { relationName: "InvoiceV2ToLanguage" }),
}));
