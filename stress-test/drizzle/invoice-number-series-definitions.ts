import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const invoiceNumberSeriesDefinitions = pgTable(
  "InvoiceNumberSeriesDefinition",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),
    ownerUserId: text("ownerUserId"),
    formatString: text("formatString").notNull(),
    description: text("description"),
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
);
