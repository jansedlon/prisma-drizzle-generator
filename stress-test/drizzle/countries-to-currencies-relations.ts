import { relations } from "drizzle-orm";
import { countriesToCurrencies } from "./countries-to-currencies.js";
import { countries } from "./countries.js";
import { currencies } from "./currencies.js";

export const countriesToCurrenciesRelations = relations(
  countriesToCurrencies,
  (helpers) => ({
    country: helpers.one(countries, {
      fields: [countriesToCurrencies.A],
      references: [countries.id],
    }),
    currency: helpers.one(currencies, {
      fields: [countriesToCurrencies.B],
      references: [currencies.code],
    }),
  }),
);
