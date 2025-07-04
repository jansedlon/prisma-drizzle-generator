import { pgTable, text } from "drizzle-orm/pg-core";

export const countriesToCurrencies = pgTable("_CountryToCurrency", {
  A: text("A").notNull(),
  B: text("B").notNull(),
});
