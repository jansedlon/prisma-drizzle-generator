import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import type { InvoiceCustomFieldRenderSection } from "@flixydev/flixy-types/prisma";

export const invoiceCustomFields = pgTable("InvoiceCustomField", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  invoiceId: text("invoiceId").notNull(),
  fieldName: text("fieldName").notNull(),
  value: text("value").notNull(),
  renderSection: text("renderSection")
    .$type<InvoiceCustomFieldRenderSection>()
    .notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
