import { text, pgTable } from 'drizzle-orm/pg-core';

export const mappingField = pgTable('MappingField', {
  id: text('id').primaryKey(),
  code: text('alpha2').notNull()
});