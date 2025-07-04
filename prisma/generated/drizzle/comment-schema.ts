import { text, boolean, timestamp, pgTable } from 'drizzle-orm/pg-core';

export const comment = pgTable('comments', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  postId: text('postId').notNull(),
  authorId: text('authorId').notNull(),
  parentId: text('parentId'),
  isDeleted: boolean('isDeleted').notNull().default(false),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true, mode: "date" }).notNull().$onUpdate(() => new Date())
});