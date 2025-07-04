import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const currencyLocalizations = pgTable("CurrencyLocalization", {
  name: text("name").notNull(),
  languageId: text("languageId").notNull(),
  currencyCode: text("currencyCode").notNull(),
  namePlural: text("namePlural").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
