import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const userSubscriptionV2UsageRecords = pgTable(
  "UserSubscriptionV2UsageRecord",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),
    timestamp: integer("timestamp").notNull(),
    quantity: integer("quantity").notNull(),
    userSubscriptionProductPriceId: text(
      "userSubscriptionProductPriceId",
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
