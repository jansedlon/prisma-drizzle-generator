import { relations } from "drizzle-orm";
import { serviceIntegrations } from "./service-integrations.js";
import { usersOnServiceIntegrations } from "./users-on-service-integrations.js";

export const serviceIntegrationsRelations = relations(
  serviceIntegrations,
  (helpers) => ({
    userIntegrations: helpers.many(usersOnServiceIntegrations, {
      relationName: "ServiceIntegrationToUsersOnServiceIntegrations",
    }),
  }),
);
