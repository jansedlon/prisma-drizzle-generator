import { text, boolean, jsonb, timestamp, pgTable } from 'drizzle-orm/pg-core';

export const notification = pgTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message'),
  isRead: boolean('isRead').notNull().default(false),
  data: jsonb('data'),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: "date" }).notNull().defaultNow()
});