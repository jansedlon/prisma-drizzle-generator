import { text, timestamp, pgTable, defaultNow, $onUpdate } from 'drizzle-orm/pg-core';
import { statusEnum, priorityEnum } from './enums.js';

export const task = pgTable('tasks', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  status: statusEnum('status').notNull().default('PENDING'),
  priority: priorityEnum('priority').notNull().default('MEDIUM'),
  projectId: text('projectId').notNull(),
  assigneeId: text('assigneeId'),
  dueDate: timestamp('dueDate', { withTimezone: true, mode: "date" }),
  completedAt: timestamp('completedAt', { withTimezone: true, mode: "date" }),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: "date" }).notNull().default(defaultNow()),
  updatedAt: timestamp('updatedAt', { withTimezone: true, mode: "date" }).notNull().$onUpdate(() => new Date())
});