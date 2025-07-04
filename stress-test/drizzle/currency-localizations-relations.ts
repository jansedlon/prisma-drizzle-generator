import { relations } from "drizzle-orm";
import { currencyLocalizations } from "./currency-localizations.js";
import { languages } from "./languages.js";
import { currencies } from "./currencies.js";

export const currencyLocalizationsRelations = relations(
  currencyLocalizations,
  (helpers) => ({
    language: helpers.one(languages, {
      relationName: "CurrencyLocalizationToLanguage",
      fields: [currencyLocalizations.languageId],
      references: [languages.id],
    }),
    currency: helpers.one(currencies, {
      relationName: "CurrencyToCurrencyLocalization",
      fields: [currencyLocalizations.currencyCode],
      references: [currencies.code],
    }),
  }),
);
