import { text, pgTable } from 'drizzle-orm/pg-core';

export const transactionHeader = pgTable('TransactionHeader', {
  id: text('id').primaryKey()
});