import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const storeProductSubscriptions = pgTable("StoreProductSubscription", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  productId: text("productId").notNull(),
  storeCustomerId: text("storeCustomerId").notNull(),
  storeId: text("storeId").notNull(),
  orderId: text("orderId").notNull(),
  stripePriceId: text("stripePriceId").notNull(),
  stripeCustomerId: text("stripeCustomerId").notNull(),
  providerId: text("providerId").notNull(),
  boundedForCommunities: text("boundedForCommunities").array().notNull(),
  startsAt: timestamp("startsAt", { mode: "date", precision: 3 }).notNull(),
  endsAt: timestamp("endsAt", { mode: "date", precision: 3 }).notNull(),
  cancelledAt: timestamp("cancelledAt", { mode: "date", precision: 3 }),
  failedPaymentNotificationSentAt: timestamp(
    "failedPaymentNotificationSentAt",
    { mode: "date", precision: 3 },
  ),
  status: text("status").notNull(),
  trialPeriodDays: integer("trialPeriodDays"),
  afterTrialPeriodPrice: integer("afterTrialPeriodPrice"),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
