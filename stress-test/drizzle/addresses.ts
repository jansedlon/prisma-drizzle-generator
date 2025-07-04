import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const addresses = pgTable("Address", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  address1: text("address1"),
  address2: text("address2"),
  city: text("city"),
  postalCode: text("postalCode"),
  state: text("state"),
  countryId: text("countryId"),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
