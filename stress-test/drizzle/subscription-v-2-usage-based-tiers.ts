import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const subscriptionV2UsageBasedTiers = pgTable(
  "SubscriptionV2UsageBasedTier",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),
    from: integer("from").notNull(),
    to: integer("to"),
    perUnitPrice: integer("perUnitPrice"),
    flatFeePrice: integer("flatFeePrice"),
    subscriptionUsageBasedPriceId: text(
      "subscriptionUsageBasedPriceId",
    ).notNull(),
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
);
