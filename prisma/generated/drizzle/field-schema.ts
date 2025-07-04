import { text, boolean, integer, bigint, real, decimal, timestamp, jsonb, enumEnum, pgTable, pgEnum } from 'drizzle-orm/pg-core';
import { enumEnum } from './enums.js';

export const field = pgTable('Field', {
  id: text('id').primaryKey(),
  string: text('string'),
  boolean: boolean('boolean'),
  int: integer('int'),
  bigint: bigint('bigint', { mode: 'number' }),
  float: real('float'),
  decimal: decimal('decimal'),
  datetime: timestamp('datetime', { withTimezone: true, mode: "date" }),
  stringList: text('stringList').notNull(),
  bytes: text('bytes'),
  json: jsonb('json'),
  enum: enumEnum('enum')
});