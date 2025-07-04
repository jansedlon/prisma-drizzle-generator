import { bigint, text, pgTable } from 'drizzle-orm/pg-core';

export const autoIncrementBigInt = pgTable('AutoIncrementBigInt', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  ref: text('ref').unique().notNull()
});