import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import type { StoreThemeConfig } from "@flixydev/flixy-types/prisma";

export const storeThemes = pgTable("StoreTheme", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  internalName: text("internalName").notNull(),
  code: text("code").notNull(),
  config: jsonb("config").$type<StoreThemeConfig>().notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
