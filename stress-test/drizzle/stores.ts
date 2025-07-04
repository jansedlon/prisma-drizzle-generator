import { pgTable, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { storeStatusEnum } from "./store-status-enum.js";
import type { StoreThemeConfig } from "@flixydev/flixy-types/prisma";
import { storeCustomDomainStatusEnum } from "./store-custom-domain-status-enum.js";

export const stores = pgTable("Store", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  displayName: text("displayName").notNull(),
  publicEmail: text("publicEmail").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  legacySlug: text("legacySlug"),
  lastChangedSlugAt: timestamp("lastChangedSlugAt", {
    mode: "date",
    precision: 3,
  }),
  status: storeStatusEnum("status").default("PUBLISHED").notNull(),
  tos: text("tos"),
  importCode: text("importCode"),
  tosEnabled: boolean("tosEnabled").default(false).notNull(),
  gdpr: text("gdpr"),
  gdprEnabled: boolean("gdprEnabled").default(false).notNull(),
  themeId: text("themeId").notNull(),
  themeOverrides: jsonb("themeOverrides").$type<StoreThemeConfig>().notNull(),
  customDomain: text("customDomain"),
  customDomainStatus: storeCustomDomainStatusEnum("customDomainStatus"),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
