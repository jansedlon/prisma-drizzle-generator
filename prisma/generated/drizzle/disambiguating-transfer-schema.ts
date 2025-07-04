import { text, timestamp, pgTable } from 'drizzle-orm/pg-core';

export const disambiguating_Transfer = pgTable('Disambiguating_Transfer', {
  id: text('id').primaryKey(),
  fromId: text('fromId').notNull(),
  toId: text('toId').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: "date" }).notNull().default(default())
});