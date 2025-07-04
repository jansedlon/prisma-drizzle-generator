import { pgTable, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import type { StoreSectionData } from "@flixydev/flixy-types/prisma";

export const storeSections = pgTable("StoreSection", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  storeId: text("storeId").notNull(),
  orderPosition: integer("orderPosition").default(999).notNull(),
  data: jsonb("data").$type<StoreSectionData>().notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
