import { integer, text, pgTable } from 'drizzle-orm/pg-core';

export const autoIncrement = pgTable('AutoIncrement', {
  id: integer('id').primaryKey(),
  ref: text('ref').unique().notNull()
});