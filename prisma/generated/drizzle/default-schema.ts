import { text, timestamp, integer, boolean, bigint, decimal, real, enum_for_defaultEnum, jsonb, pgTable, sql, pgEnum } from 'drizzle-orm/pg-core';
import { enum_for_defaultEnum } from './enums.js';

export const defaultTable = pgTable('Default', {
  id: text('id').primaryKey(),
  alsoId: text('alsoId'),
  salt: text('salt'),
  pgUuid: text('pgUuid').notNull().default(sql`gen_random_uuid()`),
  date: timestamp('date', { withTimezone: true, mode: "date" }).notNull().default('2024-01-23T00:00:00+00:00'),
  int: integer('int').notNull().default(1),
  boolean: boolean('boolean').notNull().default(true),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: "date" }).notNull().default(default()),
  string: text('string').notNull().default('John'),
  bigint: bigint('bigint', { mode: 'number' }).notNull().default('1'),
  decimal: decimal('decimal').notNull().default(1.123),
  float: real('float').notNull().default(1.123),
  bytes: text('bytes').notNull().default('aGVsbG8gd29ybGQ='),
  enum: enum_for_defaultEnum('enum').notNull().default('TypeTwo'),
  json: jsonb('json').notNull().default('{"foo": "bar"}'),
  stringList: text('stringList').notNull().default(['John', 'Doe'])
});