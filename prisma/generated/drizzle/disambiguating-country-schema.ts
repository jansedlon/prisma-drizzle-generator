import { text, pgTable } from 'drizzle-orm/pg-core';

export const disambiguating_Country = pgTable('Disambiguating_Country', {
  id: text('id').primaryKey()
});