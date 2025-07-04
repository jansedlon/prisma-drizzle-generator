import { relations } from "drizzle-orm";
import { storeThemeTranslations } from "./store-theme-translations.js";
import { languages } from "./languages.js";
import { storeThemes } from "./store-themes.js";

export const storeThemeTranslationsRelations = relations(
  storeThemeTranslations,
  (helpers) => ({
    language: helpers.one(languages, {
      relationName: "LanguageToStoreThemeTranslations",
      fields: [storeThemeTranslations.languageId],
      references: [languages.id],
    }),
    theme: helpers.one(storeThemes, {
      relationName: "StoreThemeToStoreThemeTranslations",
      fields: [storeThemeTranslations.themeId],
      references: [storeThemes.id],
    }),
  }),
);
