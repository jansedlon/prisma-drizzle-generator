import { relations } from "drizzle-orm";
import { usersOnServiceIntegrations } from "./users-on-service-integrations.js";
import { users } from "./users.js";
import { serviceIntegrations } from "./service-integrations.js";

export const usersOnServiceIntegrationsRelations = relations(
  usersOnServiceIntegrations,
  (helpers) => ({
    user: helpers.one(users, {
      relationName: "UserToUsersOnServiceIntegrations",
      fields: [usersOnServiceIntegrations.userId],
      references: [users.id],
    }),
    serviceIntegration: helpers.one(serviceIntegrations, {
      relationName: "ServiceIntegrationToUsersOnServiceIntegrations",
      fields: [usersOnServiceIntegrations.serviceIntegrationName],
      references: [serviceIntegrations.name],
    }),
  }),
);
