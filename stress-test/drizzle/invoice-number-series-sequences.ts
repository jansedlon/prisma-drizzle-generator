import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const invoiceNumberSeriesSequences = pgTable(
  "InvoiceNumberSeriesSequence",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),
    seriesDefinitionId: text("seriesDefinitionId").notNull(),
    periodIdentifier: text("periodIdentifier").notNull(),
    lastSequenceNumber: integer("lastSequenceNumber").notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
  },
);
