import { pgTable, text, integer, bigint, real, decimal, boolean, timestamp, jsonb, bytea, serial, uuid, pgEnum } from 'drizzle-orm/pg-core';

export const tag = pgTable('tags', {
  id: text('id').primaryKey().default(crypto.randomUUID()),
  name: text('name').unique().notNull()
});