import { relations } from "drizzle-orm";
import { referrerSettings } from "./referrer-settings.js";
import { users } from "./users.js";

export const referrerSettingsRelations = relations(
  referrerSettings,
  (helpers) => ({
    user: helpers.one(users, {
      relationName: "ReferrerSettingsToUser",
      fields: [referrerSettings.userId],
      references: [users.id],
    }),
  }),
);
