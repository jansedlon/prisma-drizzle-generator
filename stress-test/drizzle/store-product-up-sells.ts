import { pgTable, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { storeProductUpSellTypeEnum } from "./store-product-up-sell-type-enum.js";
import type { UpSellBumpData } from "@flixydev/flixy-types/prisma";

export const storeProductUpSells = pgTable("StoreProductUpSell", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  productId: text("productId").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  customVatRate: integer("customVatRate"),
  order: integer("order").notNull(),
  type: storeProductUpSellTypeEnum("type").notNull(),
  name: text("name").notNull(),
  data: jsonb("data").$type<UpSellBumpData>().notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  deletedAt: timestamp("deletedAt", { mode: "date", precision: 3 }),
});
