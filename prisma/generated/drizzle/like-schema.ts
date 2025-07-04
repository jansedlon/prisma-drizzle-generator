import { text, timestamp, pgTable, defaultNow, unique } from 'drizzle-orm/pg-core';

export const like = pgTable('likes', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  postId: text('postId'),
  commentId: text('commentId'),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: "date" }).notNull().default(defaultNow()),
  unique().on('userId', 'postId'),
  unique().on('userId', 'commentId')
});