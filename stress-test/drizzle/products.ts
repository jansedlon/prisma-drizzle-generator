import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const products = pgTable("Product", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  internalName: text("internalName").notNull(),
  internalDescription: text("internalDescription").notNull(),
  migrateToProductId: text("migrateToProductId"),
  stripeProductId: text("stripeProductId"),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
