import { pgEnum } from "drizzle-orm/pg-core";

export const storeOrderStatusEnum = pgEnum("StoreOrderStatus", [
  "FULFILLING",
  "REFUNDED",
  "COMPLETED",
]);
