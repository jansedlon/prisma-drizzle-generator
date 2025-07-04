import { relations } from "drizzle-orm";
import { countries } from "./countries.js";
import { countriesToCurrencies } from "./countries-to-currencies.js";
import { users } from "./users.js";
import { userInvoices } from "./user-invoices.js";
import { addresses } from "./addresses.js";
import { storeCustomers } from "./store-customers.js";
import { invoiceV2S } from "./invoice-v-2-s.js";

export const countriesRelations = relations(countries, (helpers) => ({
  currencies: helpers.many(countriesToCurrencies),
  users: helpers.many(users, { relationName: "UserToCountry" }),
  usersBilling: helpers.many(users, { relationName: "UserToCountryBilling" }),
  userInvoices: helpers.many(userInvoices, {
    relationName: "CountryToUserInvoice",
  }),
  addresses: helpers.many(addresses, { relationName: "AddressToCountry" }),
  storeCustomers: helpers.many(storeCustomers, {
    relationName: "CountryToStoreCustomer",
  }),
  issuerInvoices: helpers.many(invoiceV2S, { relationName: "IssuerInvoices" }),
  customerInvoices: helpers.many(invoiceV2S, {
    relationName: "CustomerInvoices",
  }),
  ossDestinationInvoices: helpers.many(invoiceV2S, {
    relationName: "OSSDestinationInvoices",
  }),
}));
