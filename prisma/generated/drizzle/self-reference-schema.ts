import { text, pgTable } from 'drizzle-orm/pg-core';

export const selfReference = pgTable('SelfReference', {
  id: text('id').primaryKey(),
  referringManyId: text('referringManyId'),
  referringUniqueId: text('referringUniqueId').unique()
});