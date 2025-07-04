import { pgTable, text, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { serviceIntegrationNameEnum } from "./service-integration-name-enum.js";

export const usersOnServiceIntegrations = pgTable(
  "UsersOnServiceIntegrations",
  {
    userId: text("userId").notNull(),
    serviceIntegrationName: serviceIntegrationNameEnum(
      "serviceIntegrationName",
    ).notNull(),
    enabled: boolean("enabled").default(true).notNull(),
    settings: jsonb("settings").notNull(),
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
);
