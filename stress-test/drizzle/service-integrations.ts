import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { serviceIntegrationNameEnum } from "./service-integration-name-enum.js";

export const serviceIntegrations = pgTable("ServiceIntegration", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: serviceIntegrationNameEnum("name").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
