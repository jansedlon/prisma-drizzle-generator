import { relations } from 'drizzle-orm';
import { disambiguating_User } from './disambiguating-user-schema.js';
import { disambiguating_Transfer } from './disambiguating-transfer-schema.js';

export const disambiguating_UserRelations = relations(disambiguating_User, ({ one, many }) => ({
  disambiguating_Transfer_tos: many(disambiguating_Transfer),
  disambiguating_Transfer_froms: many(disambiguating_Transfer)
}));