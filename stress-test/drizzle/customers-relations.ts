import { relations } from "drizzle-orm";
import { customers } from "./customers.js";
import { storeCustomers } from "./store-customers.js";

export const customersRelations = relations(customers, (helpers) => ({
  storeCustomers: helpers.many(storeCustomers, {
    relationName: "CustomerToStoreCustomer",
  }),
}));
