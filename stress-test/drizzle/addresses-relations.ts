import { relations } from "drizzle-orm";
import { addresses } from "./addresses.js";
import { countries } from "./countries.js";
import { users } from "./users.js";
import { invoicingSettings } from "./invoicing-settings.js";

export const addressesRelations = relations(addresses, (helpers) => ({
  country: helpers.one(countries, {
    relationName: "AddressToCountry",
    fields: [addresses.countryId],
    references: [countries.id],
  }),
  users: helpers.many(users, { relationName: "AddressToUser" }),
  invoicingSettings: helpers.one(invoicingSettings),
}));
