import { text, timestamp, pgTable, defaultNow, unique } from 'drizzle-orm/pg-core';

export const teamMember = pgTable('team_members', {
  id: text('id').primaryKey(),
  teamId: text('teamId').notNull(),
  userId: text('userId').notNull(),
  role: text('role').notNull().default('member'),
  joinedAt: timestamp('joinedAt', { withTimezone: true, mode: "date" }).notNull().default(defaultNow()),
  unique().on('teamId', 'userId')
});