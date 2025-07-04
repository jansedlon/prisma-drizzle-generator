import { pgTable, text } from "drizzle-orm/pg-core";

export const discountCodeToStoreProducts = pgTable(
  "DiscountCodeToStoreProduct",
  {
    discountCodeId: text("discountCodeId").notNull(),
    productId: text("productId").notNull(),
  },
);
