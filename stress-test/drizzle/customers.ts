import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const customers = pgTable("Customer", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  phone: text("phone"),
  preferredLocale: text("preferredLocale"),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
