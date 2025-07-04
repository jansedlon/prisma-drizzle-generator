import { text, boolean, timestamp, varchar, jsonb, pgTable, defaultNow, $onUpdate } from 'drizzle-orm/pg-core';

export const post = pgTable('posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  content: text('content'),
  excerpt: text('excerpt'),
  published: boolean('published').notNull().default(false),
  publishedAt: timestamp('publishedAt', { withTimezone: true, mode: "date" }),
  authorId: text('authorId').notNull(),
  categoryId: text('categoryId'),
  longContent: text('longContent'),
  metaDescription: varchar('metaDescription', { length: 160 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: "date" }).notNull().default(defaultNow()),
  updatedAt: timestamp('updatedAt', { withTimezone: true, mode: "date" }).notNull().$onUpdate(() => new Date())
});