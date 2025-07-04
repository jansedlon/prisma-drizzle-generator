import {
  pgTable,
  text,
  integer,
  doublePrecision,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const referrerIncomes = pgTable("ReferrerIncomes", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text("userId").notNull(),
  sourceUserId: text("sourceUserId"),
  sourceAmount: integer("sourceAmount").notNull(),
  destinationAmount: integer("destinationAmount").notNull(),
  sourceCurrencyCode: text("sourceCurrencyCode").notNull(),
  destinationCurrencyCode: text("destinationCurrencyCode").notNull(),
  conversionRate: doublePrecision("conversionRate"),
  stripeTransferId: text("stripeTransferId").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
