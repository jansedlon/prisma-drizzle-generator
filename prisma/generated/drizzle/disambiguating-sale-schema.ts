import { text, pgTable } from 'drizzle-orm/pg-core';

export const disambiguating_Sale = pgTable('Disambiguating_Sale', {
  id: text('id').primaryKey(),
  paymentId: text('paymentId').unique().notNull(),
  taxId: text('taxId').unique().notNull()
});