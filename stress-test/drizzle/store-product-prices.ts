import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const storeProductPrices = pgTable("StoreProductPrice", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  productId: text("productId").notNull(),
  amount: integer("amount").notNull(),
  currencyCode: text("currencyCode").notNull(),
  discountAmount: integer("discountAmount"),
});
