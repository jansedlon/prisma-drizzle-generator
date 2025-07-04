import { relations } from 'drizzle-orm';
import { project } from './project-schema.js';
import { team } from './team-schema.js';
import { task } from './task-schema.js';

export const projectRelations = relations(project, ({ one, many }) => ({
  projectToTeams: many(project),
  projectToTeam: one(team, {
    fields: [project.teamId],
    references: [team.id],
    onDelete: 'setNull',
    
  }),
  projectToTasks: many(task)
}));