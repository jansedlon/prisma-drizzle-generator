import { relations } from "drizzle-orm";
import { userInvoices } from "./user-invoices.js";
import { users } from "./users.js";
import { currencies } from "./currencies.js";
import { subscriptions } from "./subscriptions.js";
import { userSubscriptionProductV2S } from "./user-subscription-product-v-2-s.js";
import { countries } from "./countries.js";
import { userInvoiceLineItems } from "./user-invoice-line-items.js";

export const userInvoicesRelations = relations(userInvoices, (helpers) => ({
  user: helpers.one(users, {
    relationName: "UserToUserInvoice",
    fields: [userInvoices.userId],
    references: [users.id],
  }),
  currency: helpers.one(currencies, {
    relationName: "CurrencyToUserInvoice",
    fields: [userInvoices.currencyCode],
    references: [currencies.code],
  }),
  subscription: helpers.one(subscriptions, {
    relationName: "SubscriptionToUserInvoice",
    fields: [userInvoices.subscriptionId],
    references: [subscriptions.id],
  }),
  subscriptionV2: helpers.one(userSubscriptionProductV2S, {
    relationName: "UserInvoiceToUserSubscriptionProductV2",
    fields: [userInvoices.subscriptionV2Id],
    references: [userSubscriptionProductV2S.id],
  }),
  Country: helpers.one(countries, {
    relationName: "CountryToUserInvoice",
    fields: [userInvoices.countryId],
    references: [countries.id],
  }),
  UserInvoiceLineItem: helpers.many(userInvoiceLineItems, {
    relationName: "UserInvoiceToUserInvoiceLineItem",
  }),
}));
