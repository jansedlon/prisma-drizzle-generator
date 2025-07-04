import { pgEnum } from "drizzle-orm/pg-core";

export const subscriptionStatusEnum = pgEnum("SubscriptionStatus", [
  "INACTIVE",
  "PROVISIONED",
  "ACTIVE",
  "UPGRADED",
]);
