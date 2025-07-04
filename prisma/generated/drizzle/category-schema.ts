import { text, pgTable } from 'drizzle-orm/pg-core';

export const category = pgTable('Category', {
  id: text('id').primaryKey()
});