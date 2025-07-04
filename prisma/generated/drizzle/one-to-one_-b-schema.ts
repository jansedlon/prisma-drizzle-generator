import { text, pgTable } from 'drizzle-orm/pg-core';

export const oneToOne_B = pgTable('OneToOne_B', {
  id: text('id').primaryKey()
});