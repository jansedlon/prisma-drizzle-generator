import { text, timestamp, pgTable, defaultNow, $onUpdate } from 'drizzle-orm/pg-core';
import { statusEnum, priorityEnum } from './enums.js';

export const project = pgTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  status: statusEnum('status').notNull().default('PENDING'),
  priority: priorityEnum('priority').notNull().default('MEDIUM'),
  teamId: text('teamId'),
  startDate: timestamp('startDate', { withTimezone: true, mode: "date" }),
  endDate: timestamp('endDate', { withTimezone: true, mode: "date" }),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: "date" }).notNull().default(defaultNow()),
  updatedAt: timestamp('updatedAt', { withTimezone: true, mode: "date" }).notNull().$onUpdate(() => new Date())
});