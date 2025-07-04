import { integer, bigint, pgTable } from 'drizzle-orm/pg-core';

export const fieldCustomization = pgTable('FieldCustomization', {
  id: integer('id').primaryKey(),
  allFields: bigint('allFields', { mode: 'number' }).notNull()
});