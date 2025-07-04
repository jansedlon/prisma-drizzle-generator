import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const userSubscriptionV2ProductPrices = pgTable(
  "UserSubscriptionV2ProductPrice",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),
    userSubscriptionProductId: text("userSubscriptionProductId").notNull(),
    priceId: text("priceId").notNull(),
    subscriptionUsageBasedPriceId: text("subscriptionUsageBasedPriceId"),
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
);
