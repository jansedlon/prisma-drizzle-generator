import { relations } from "drizzle-orm";
import { storeToUsers } from "./store-to-users.js";
import { stores } from "./stores.js";
import { users } from "./users.js";

export const storeToUsersRelations = relations(storeToUsers, (helpers) => ({
  store: helpers.one(stores, {
    relationName: "StoreToStoreToUser",
    fields: [storeToUsers.storeId],
    references: [stores.id],
  }),
  user: helpers.one(users, {
    relationName: "StoreToUserToUser",
    fields: [storeToUsers.userId],
    references: [users.id],
  }),
}));
