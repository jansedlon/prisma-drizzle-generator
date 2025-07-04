import { pgTable, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import type { StoreOrderData } from "@flixydev/flixy-types/prisma";
import { storeOrderStatusEnum } from "./store-order-status-enum.js";

export const storeOrders = pgTable("StoreOrder", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  storeId: text("storeId").notNull(),
  pageId: text("pageId").notNull(),
  paymentGateway: text("paymentGateway").notNull(),
  currencyCode: text("currencyCode").notNull(),
  funnelSession: text("funnelSession"),
  amount: integer("amount").notNull(),
  net: integer("net").notNull(),
  customVatRate: integer("customVatRate"),
  ip: text("ip"),
  storeCustomerId: text("storeCustomerId").notNull(),
  data: jsonb("data").$type<StoreOrderData>().notNull(),
  status: storeOrderStatusEnum("status").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  funnelId: text("funnelId"),
});
