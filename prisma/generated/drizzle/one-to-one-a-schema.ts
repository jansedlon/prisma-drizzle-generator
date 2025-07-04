import { text, pgTable } from 'drizzle-orm/pg-core';

export const oneToOne_A = pgTable('OneToOne_A', {
  id: text('id').primaryKey(),
  bId: text('bId').unique()
});