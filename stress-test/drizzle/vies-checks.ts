import { pgTable, text, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const viesChecks = pgTable("ViesCheckV2", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  checkedVatNumber: text("checkedVatNumber").notNull(),
  checkedCountryCode: text("checkedCountryCode").notNull(),
  isValid: boolean("isValid").notNull(),
  name: text("name"),
  address: text("address"),
  checkedAt: timestamp("checkedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  rawResponse: jsonb("rawResponse"),
  requestIdentifier: text("requestIdentifier"),
});
