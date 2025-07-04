import { relations } from "drizzle-orm";
import { storeThemes } from "./store-themes.js";
import { storeThemeTranslations } from "./store-theme-translations.js";
import { stores } from "./stores.js";

export const storeThemesRelations = relations(storeThemes, (helpers) => ({
  translations: helpers.many(storeThemeTranslations, {
    relationName: "StoreThemeToStoreThemeTranslations",
  }),
  stores: helpers.many(stores, { relationName: "StoreToStoreTheme" }),
}));
