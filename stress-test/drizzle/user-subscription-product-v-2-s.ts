import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import type { SubscriptionV2Status } from "@flixydev/flixy-types/prisma";

export const userSubscriptionProductV2S = pgTable("UserSubscriptionProductV2", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  cancelledAt: timestamp("cancelledAt", { mode: "date", precision: 3 }),
  stripeSubscriptionId: text("stripeSubscriptionId"),
  status: text("status").$type<SubscriptionV2Status>().notNull(),
  quantity: integer("quantity"),
  currentPeriodStart: timestamp("currentPeriodStart", {
    mode: "date",
    precision: 3,
  }).notNull(),
  currentPeriodEnd: timestamp("currentPeriodEnd", {
    mode: "date",
    precision: 3,
  }).notNull(),
  failedPaymentNotificationSentAt: timestamp(
    "failedPaymentNotificationSentAt",
    { mode: "date", precision: 3 },
  ),
  downgradeToPriceId: text("downgradeToPriceId"),
  userId: text("userId").notNull(),
  subscriptionProductId: text("subscriptionProductId").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
