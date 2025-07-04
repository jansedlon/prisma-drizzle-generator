import { pgTable, text, integer, bigint, real, decimal, boolean, timestamp, jsonb, bytea, serial, uuid, pgEnum } from 'drizzle-orm/pg-core';

export const post = pgTable('posts', {
  id: text('id').primaryKey().default(crypto.randomUUID()),
  title: text('title').notNull(),
  content: text('content'),
  published: boolean('published').notNull(),
  authorId: text('authorId').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: "date" }).notNull().default(new Date()),
  updatedAt: timestamp('updatedAt', { withTimezone: true, mode: "date" }).notNull()
});