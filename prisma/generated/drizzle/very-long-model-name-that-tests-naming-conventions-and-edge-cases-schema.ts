import { text, pgTable } from 'drizzle-orm/pg-core';

export const veryLongModelNameThatTestsNamingConventionsAndEdgeCases = pgTable('very_long_table_name_for_testing', {
  id: text('id').primaryKey(),
  aVeryLongFieldNameThatMightCauseIssues: text('aVeryLongFieldNameThatMightCauseIssues').notNull(),
  field_with_underscores: text('field_with_underscores').notNull(),
  fieldWithNumbers123: text('fieldWithNumbers123').notNull()
});