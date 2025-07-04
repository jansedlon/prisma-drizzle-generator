import { text, pgTable } from 'drizzle-orm/pg-core';

export const modelWithIgnoredField = pgTable('ModelWithIgnoredField', {
  id: text('id').primaryKey()
});