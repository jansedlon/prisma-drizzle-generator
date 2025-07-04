import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import type { StoreCustomerIntegrationData } from "@flixydev/flixy-types/prisma";

export const storeCustomers = pgTable("StoreCustomer", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  stripeCustomerId: text("stripeCustomerId"),
  integrationData:
    jsonb("integrationData").$type<StoreCustomerIntegrationData>(),
  name: text("name"),
  email: text("email").notNull(),
  phone: text("phone"),
  preferredLocale: text("preferredLocale"),
  storeId: text("storeId").notNull(),
  userId: text("userId"),
  customerId: text("customerId"),
  countryCode: text("countryCode"),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
