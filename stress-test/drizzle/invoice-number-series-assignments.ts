import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const invoiceNumberSeriesAssignments = pgTable(
  "InvoiceNumberSeriesAssignment",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),
    baseContextKey: text("baseContextKey").notNull(),
    ownerUserId: text("ownerUserId"),
    seriesDefinitionId: text("seriesDefinitionId").notNull(),
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
);
