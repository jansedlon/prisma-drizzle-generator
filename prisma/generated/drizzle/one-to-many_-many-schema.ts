import { text, pgTable } from 'drizzle-orm/pg-core';

export const oneToMany_Many = pgTable('OneToMany_Many', {
  id: text('id').primaryKey()
});