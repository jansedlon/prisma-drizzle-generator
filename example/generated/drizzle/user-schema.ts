import { pgTable, text, integer, bigint, real, decimal, boolean, timestamp, jsonb, bytea, serial, uuid, pgEnum, user_roleEnum } from 'drizzle-orm/pg-core';
import { user_roleEnum } from './enums.js';

export const user = pgTable('users', {
  id: text('id').primaryKey().default(crypto.randomUUID()),
  email: text('email').unique().notNull(),
  name: text('name'),
  role: user_roleEnum('role').notNull().default('USER'),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: "date" }).notNull().default(new Date()),
  updatedAt: timestamp('updatedAt', { withTimezone: true, mode: "date" }).notNull(),
  username: text('username').unique().notNull(),
  points: integer('points').notNull()
});