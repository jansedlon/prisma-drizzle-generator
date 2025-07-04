import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const userInvoices = pgTable("UserInvoice", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text("userId").notNull(),
  stripeInvoiceId: text("stripeInvoiceId").notNull(),
  currencyCode: text("currencyCode").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull(),
  subscriptionId: text("subscriptionId"),
  subscriptionV2Id: text("subscriptionV2Id"),
  hidden: boolean("hidden"),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  reason: text("reason").notNull(),
  lastPaymentError: text("lastPaymentError"),
  link: text("link"),
  countryId: text("countryId"),
});
