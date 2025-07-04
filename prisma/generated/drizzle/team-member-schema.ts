import { text, timestamp, pgTable, unique } from 'drizzle-orm/pg-core';

export const teamMember = pgTable('team_members', {
  id: text('id').primaryKey(),
  teamId: text('teamId').notNull(),
  userId: text('userId').notNull(),
  role: text('role').notNull().default('member'),
  joinedAt: timestamp('joinedAt', { withTimezone: true, mode: "date" }).notNull().defaultNow()
}, (table) => [
  unique().on(table.teamId, table.userId)
]);