import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const productPricings = pgTable("ProductPricing", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  productId: text("productId").notNull(),
  fromDate: timestamp("fromDate", { mode: "date", precision: 3 }).notNull(),
  toDate: timestamp("toDate", { mode: "date", precision: 3 }).notNull(),
  migrateToProductV2PricingId: text("migrateToProductV2PricingId"),
  price: integer("price").notNull(),
  currencyCode: text("currencyCode").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
