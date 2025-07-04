import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const productLocalizations = pgTable("ProductLocalization", {
  name: text("name").notNull(),
  description: text("description").notNull(),
  languageId: text("languageId").notNull(),
  productId: text("productId").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
