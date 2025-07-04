import { relations } from 'drizzle-orm';
import { project } from './project-schema.js';
import { team } from './team-schema.js';
import { task } from './task-schema.js';

export const projectRelations = relations(project, ({ one, many }) => ({
  projects: many(team),
  team: one(team, {
    fields: [project.teamId],
    references: [team.id]
  }),
  tasks: many(task)
}));