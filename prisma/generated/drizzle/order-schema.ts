import { text, integer, pgTable } from 'drizzle-orm/pg-core';

export const order = pgTable('orders', {
  id: text('id').primaryKey(),
  select: text('select').notNull(),
  from: text('from').notNull(),
  where: text('where').notNull(),
  order: integer('order').notNull(),
  group: text('group').notNull()
});