import { relations } from 'drizzle-orm';
import { userSettings } from './user-settings-schema.js';
import { user } from './user-schema.js';

export const userSettingsRelations = relations(userSettings, ({ one, many }) => ({
  settings: one(user, {
    fields: [userSettings.userId],
    references: [user.id]
  }),
  user: one(user, {
    fields: [userSettings.userId],
    references: [user.id]
  })
}));