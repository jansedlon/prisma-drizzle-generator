import { text, timestamp, pgTable, defaultNow, unique, $onUpdate } from 'drizzle-orm/pg-core';

export const friendship = pgTable('friendships', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  friendId: text('friendId').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: "date" }).notNull().default(defaultNow()),
  updatedAt: timestamp('updatedAt', { withTimezone: true, mode: "date" }).notNull().$onUpdate(() => new Date()),
  unique().on('userId', 'friendId')
});