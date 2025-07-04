import { text, pgTable } from 'drizzle-orm/pg-core';

export const disambiguating_Currency = pgTable('Disambiguating_Currency', {
  code: text('code').primaryKey()
});