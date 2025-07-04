import { relations } from "drizzle-orm";
import { referrerIncomes } from "./referrer-incomes.js";
import { users } from "./users.js";
import { currencies } from "./currencies.js";

export const referrerIncomesRelations = relations(
  referrerIncomes,
  (helpers) => ({
    user: helpers.one(users, {
      relationName: "ReferrerIncomesToUser",
      fields: [referrerIncomes.userId],
      references: [users.id],
    }),
    sourceUser: helpers.one(users, {
      relationName: "ReferrerIncomesSourceUser",
      fields: [referrerIncomes.sourceUserId],
      references: [users.id],
    }),
    sourceCurrency: helpers.one(currencies, {
      relationName: "ReferrerIncomesSourceCurrency",
      fields: [referrerIncomes.sourceCurrencyCode],
      references: [currencies.code],
    }),
    destinationCurrency: helpers.one(currencies, {
      relationName: "ReferrerIncomesDestinationCurrency",
      fields: [referrerIncomes.destinationCurrencyCode],
      references: [currencies.code],
    }),
  }),
);
