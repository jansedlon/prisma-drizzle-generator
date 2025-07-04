import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const storeToUsers = pgTable("StoreToUser", {
  storeId: text("storeId").notNull(),
  userId: text("userId").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
