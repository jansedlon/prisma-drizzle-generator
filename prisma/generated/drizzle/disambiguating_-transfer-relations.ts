import { relations } from 'drizzle-orm';
import { disambiguating_Transfer } from './disambiguating_-transfer-schema.js';
import { disambiguating_User } from './disambiguating_-user-schema.js';

export const disambiguating_TransferRelations = relations(disambiguating_Transfer, ({ one, many }) => ({
  disambiguating_Transfer_from: one(disambiguating_User, {
    fields: [disambiguating_Transfer.fromId],
    references: [disambiguating_User.id],
    
    
  }),
  disambiguating_Transfer_to: one(disambiguating_User, {
    fields: [disambiguating_Transfer.toId],
    references: [disambiguating_User.id],
    
    
  }),
  disambiguating_Transfer_tos: many(disambiguating_Transfer),
  disambiguating_Transfer_froms: many(disambiguating_Transfer)
}));