import { text, boolean, jsonb, timestamp, pgTable } from 'drizzle-orm/pg-core';

export const userSettings = pgTable('user_settings', {
  id: text('id').primaryKey(),
  userId: text('userId').unique().notNull(),
  emailNotifications: boolean('emailNotifications').notNull().default(true),
  pushNotifications: boolean('pushNotifications').notNull().default(true),
  theme: text('theme').notNull().default('light'),
  language: text('language').notNull().default('en'),
  timezone: text('timezone').notNull().default('UTC'),
  preferences: jsonb('preferences'),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true, mode: "date" }).notNull().$onUpdate(() => new Date())
});