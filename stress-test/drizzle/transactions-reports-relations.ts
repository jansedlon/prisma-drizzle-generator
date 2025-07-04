import { relations } from "drizzle-orm";
import { transactionsReports } from "./transactions-reports.js";
import { stores } from "./stores.js";

export const transactionsReportsRelations = relations(
  transactionsReports,
  (helpers) => ({
    store: helpers.one(stores, {
      relationName: "StoreToTransactionsReport",
      fields: [transactionsReports.storeId],
      references: [stores.id],
    }),
  }),
);
