import { text, timestamp, pgTable, unique } from 'drizzle-orm/pg-core';

export const like = pgTable('likes', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  postId: text('postId'),
  commentId: text('commentId'),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: "date" }).notNull().defaultNow()
}, (table) => [
  unique().on(table.userId, table.postId),
  unique().on(table.userId, table.commentId)
]);