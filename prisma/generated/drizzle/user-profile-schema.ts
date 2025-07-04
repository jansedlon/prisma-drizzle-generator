import { text, timestamp, varchar, jsonb, pgTable } from 'drizzle-orm/pg-core';

export const userProfile = pgTable('user_profiles', {
  id: text('id').primaryKey(),
  userId: text('userId').unique().notNull(),
  bio: text('bio'),
  avatar: text('avatar'),
  website: text('website'),
  location: text('location'),
  birthDate: timestamp('birthDate', { withTimezone: true, mode: "date" }),
  longBio: text('longBio'),
  shortBio: varchar('shortBio', { length: 500 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true, mode: "date" }).notNull().$onUpdate(() => new Date())
});