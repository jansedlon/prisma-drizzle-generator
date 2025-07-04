import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import type { StorePageUrgency } from "@flixydev/flixy-types/prisma";

export const storePageUrgencies = pgTable("StorePageUrgency", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  urgency: jsonb("urgency").$type<StorePageUrgency>().notNull(),
  storePageId: text("storePageId").notNull(),
  storeId: text("storeId").notNull(),
  deletedAt: timestamp("deletedAt", { mode: "date", precision: 3 }),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
