import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const storeThemeTranslations = pgTable("StoreThemeTranslations", {
  name: text("name").notNull(),
  languageId: text("languageId").notNull(),
  themeId: text("themeId").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
