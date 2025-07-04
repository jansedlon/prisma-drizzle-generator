import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const subscriptionV2UsageBasedPrices = pgTable(
  "SubscriptionV2UsageBasedPrice",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),
    stripeId: text("stripeId").notNull(),
    billingPeriod: integer("billingPeriod").notNull(),
    unit: text("unit").notNull(),
    unitTitle: text("unitTitle").notNull(),
    unitTitlePlural: text("unitTitlePlural").notNull(),
    usageType: text("usageType").notNull(),
    aggregateUsage: text("aggregateUsage").notNull(),
    tiersMode: text("tiersMode").notNull(),
    billingScheme: text("billingScheme").notNull(),
    subscriptionProductId: text("subscriptionProductId").notNull(),
    currencyCode: text("currencyCode").notNull(),
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
);
