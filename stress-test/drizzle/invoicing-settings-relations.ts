import { relations } from "drizzle-orm";
import { invoicingSettings } from "./invoicing-settings.js";
import { users } from "./users.js";
import { addresses } from "./addresses.js";

export const invoicingSettingsRelations = relations(
  invoicingSettings,
  (helpers) => ({
    user: helpers.one(users, {
      relationName: "InvoicingSettingsToUser",
      fields: [invoicingSettings.userId],
      references: [users.id],
    }),
    address: helpers.one(addresses, {
      relationName: "AddressToInvoicingSettings",
      fields: [invoicingSettings.addressId],
      references: [addresses.id],
    }),
  }),
);
