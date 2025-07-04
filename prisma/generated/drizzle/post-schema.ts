import { text, pgTable } from 'drizzle-orm/pg-core';

export const post = pgTable('Post', {
  id: text('id').primaryKey()
});