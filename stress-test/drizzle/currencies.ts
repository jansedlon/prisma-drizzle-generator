import {
  pgTable,
  text,
  doublePrecision,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const currencies = pgTable("Currency", {
  code: text("code").primaryKey(),
  internalName: text("internalName").notNull(),
  symbolNative: text("symbolNative").notNull(),
  symbol: text("symbol").notNull(),
  rounding: doublePrecision("rounding").notNull(),
  decimalDigits: integer("decimalDigits").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
});
