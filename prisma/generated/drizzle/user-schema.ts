import { text, boolean, timestamp, pgTable } from 'drizzle-orm/pg-core';
import { userRoleEnum } from './enums.js';

export const user = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  username: text('username').unique().notNull(),
  firstName: text('firstName'),
  lastName: text('lastName'),
  fullName: text('fullName').notNull().default(''),
  role: userRoleEnum('role').notNull().default('USER'),
  isActive: boolean('isActive').notNull().default(true),
  lastLoginAt: timestamp('lastLoginAt', { withTimezone: true, mode: "date" }),
  emailVerified: boolean('emailVerified').notNull().default(false),
  referredById: text('referredById'),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true, mode: "date" }).notNull().$onUpdate(() => new Date())
});