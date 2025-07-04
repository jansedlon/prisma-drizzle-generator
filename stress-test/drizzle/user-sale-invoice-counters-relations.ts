import { relations } from "drizzle-orm";
import { userSaleInvoiceCounters } from "./user-sale-invoice-counters.js";
import { users } from "./users.js";

export const userSaleInvoiceCountersRelations = relations(
  userSaleInvoiceCounters,
  (helpers) => ({
    user: helpers.one(users, {
      relationName: "UserToUserSaleInvoiceCounter",
      fields: [userSaleInvoiceCounters.userId],
      references: [users.id],
    }),
  }),
);
