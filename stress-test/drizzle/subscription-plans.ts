import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const subscriptionPlans = pgTable("SubscriptionPlan", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  productId: text("productId").notNull(),
  billingInterval: integer("billingInterval").default(1).notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
