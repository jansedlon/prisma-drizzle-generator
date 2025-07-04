import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const subscriptions = pgTable("Subscription", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  status: text("status").notNull(),
  userId: text("userId").notNull(),
  planId: text("planId").notNull(),
  startsAt: timestamp("startsAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  endsAt: timestamp("endsAt", { mode: "date", precision: 3 }).notNull(),
  providerId: text("providerId").notNull(),
  renewedAt: timestamp("renewedAt", { mode: "date", precision: 3 }),
  renewedSubscriptionId: text("renewedSubscriptionId"),
  downgradedAt: timestamp("downgradedAt", { mode: "date", precision: 3 }),
  downgradedToPlanId: text("downgradedToPlanId"),
  upgradedAt: timestamp("upgradedAt", { mode: "date", precision: 3 }),
  upgradedToPlanId: text("upgradedToPlanId"),
  cancelledAt: timestamp("cancelledAt", { mode: "date", precision: 3 }),
  failedPaymentNotificationSentAt: timestamp(
    "failedPaymentNotificationSentAt",
    { mode: "date", precision: 3 },
  ),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  deletedAt: timestamp("deletedAt", { mode: "date", precision: 3 }),
});
