import { text, pgTable } from 'drizzle-orm/pg-core';

export const oneToMany_One = pgTable('OneToMany_One', {
  id: text('id').primaryKey(),
  manyId: text('manyId').notNull()
});