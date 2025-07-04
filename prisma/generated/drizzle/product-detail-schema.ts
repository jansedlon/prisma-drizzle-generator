import { text, pgTable } from 'drizzle-orm/pg-core';

export const productDetail = pgTable('ProductDetail', {
  id: text('id').primaryKey()
});