import { text, pgTable } from 'drizzle-orm/pg-core';

export const disambiguating_User = pgTable('Disambiguating_User', {
  id: text('id').primaryKey()
});