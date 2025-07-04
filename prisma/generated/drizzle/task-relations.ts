import { relations } from 'drizzle-orm';
import { task } from './task-schema.js';
import { user } from './user-schema.js';
import { project } from './project-schema.js';

export const taskRelations = relations(task, ({ one, many }) => ({
  assignedTasks: many(user),
  tasks: many(project),
  project: one(project, {
    fields: [task.projectId],
    references: [project.id]
  }),
  assignee: one(user, {
    fields: [task.assigneeId],
    references: [user.id]
  })
}));