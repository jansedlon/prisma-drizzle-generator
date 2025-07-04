import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { invoicingSettingsLegalTypeEnum } from "./invoicing-settings-legal-type-enum.js";

export const invoicingSettings = pgTable("InvoicingSettings", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text("userId").notNull(),
  addressId: text("addressId"),
  registrationNumber: text("registrationNumber"),
  vatNumber: text("vatNumber"),
  taxPayer: boolean("taxPayer").default(false).notNull(),
  footer: text("footer"),
  vatRatePercentage: integer("vatRatePercentage").default(0).notNull(),
  legalName: text("legalName"),
  legalType: invoicingSettingsLegalTypeEnum("legalType")
    .default("NONE")
    .notNull(),
  serialNumberPrefix: text("serialNumberPrefix").default("FL").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
