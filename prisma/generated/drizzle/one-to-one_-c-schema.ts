import { text, pgTable } from 'drizzle-orm/pg-core';

export const oneToOne_C = pgTable('OneToOne_C', {
  id: text('id').primaryKey(),
  bId: text('bId').unique().notNull()
});