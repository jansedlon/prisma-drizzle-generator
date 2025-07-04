import { text, boolean, timestamp, pgTable, defaultNow, $onUpdate } from 'drizzle-orm/pg-core';
import { user_roleEnum } from './enums.js';

export const user = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  username: text('username').unique().notNull(),
  firstName: text('firstName'),
  lastName: text('lastName'),
  fullName: text('fullName').notNull().default(''),
  role: user_roleEnum('role').notNull().default('USER'),
  isActive: boolean('isActive').notNull().default(true),
  lastLoginAt: timestamp('lastLoginAt', { withTimezone: true, mode: "date" }),
  emailVerified: boolean('emailVerified').notNull().default(false),
  referredById: text('referredById'),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: "date" }).notNull().default(defaultNow()),
  updatedAt: timestamp('updatedAt', { withTimezone: true, mode: "date" }).notNull().$onUpdate(() => new Date())
});