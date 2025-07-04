import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { transactionsReportStatusEnum } from "./transactions-report-status-enum.js";

export const transactionsReports = pgTable("TransactionsReport", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  storeId: text("storeId").notNull(),
  payoutId: text("payoutId"),
  location: text("location"),
  publicLocation: text("publicLocation"),
  status: transactionsReportStatusEnum("status").default("PENDING").notNull(),
  finishedAt: timestamp("finishedAt", { mode: "date", precision: 3 }),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
