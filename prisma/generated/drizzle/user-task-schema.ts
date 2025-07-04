import { text, pgTable, primaryKey } from 'drizzle-orm/pg-core';

export const userTask = pgTable('user_tasks', {
  userId: text('userId').notNull(),
  taskId: text('taskId').notNull(),
  role: text('role').notNull().default('viewer'),
  primaryKey({ columns: ['userId', 'taskId'] })
});