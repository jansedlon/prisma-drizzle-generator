import { text, timestamp, pgTable, defaultNow, $onUpdate } from 'drizzle-orm/pg-core';

export const tag = pgTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').unique().notNull(),
  slug: text('slug').unique().notNull(),
  color: text('color'),
  description: text('description'),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: "date" }).notNull().default(defaultNow()),
  updatedAt: timestamp('updatedAt', { withTimezone: true, mode: "date" }).notNull().$onUpdate(() => new Date())
});