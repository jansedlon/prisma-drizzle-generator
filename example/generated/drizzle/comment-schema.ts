import { pgTable, text, integer, bigint, real, decimal, boolean, timestamp, jsonb, bytea, serial, uuid, pgEnum } from 'drizzle-orm/pg-core';

export const comment = pgTable('comments', {
  id: text('id').primaryKey().default(crypto.randomUUID()),
  content: text('content').notNull(),
  postId: text('postId').notNull(),
  userId: text('userId').notNull()
});