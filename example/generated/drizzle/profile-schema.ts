import { pgTable, text, integer, bigint, real, decimal, boolean, timestamp, jsonb, bytea, serial, uuid, pgEnum } from 'drizzle-orm/pg-core';

export const profile = pgTable('profiles', {
  id: text('id').primaryKey().default(crypto.randomUUID()),
  bio: text('bio'),
  avatar: text('avatar'),
  userId: text('userId').unique().notNull()
});