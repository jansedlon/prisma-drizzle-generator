import { relations } from 'drizzle-orm';
import { team } from './team-schema.js';
import { teamMember } from './team-member-schema.js';
import { project } from './project-schema.js';

export const teamRelations = relations(team, ({ one, many }) => ({
  members: many(teamMember),
  projects: many(project)
}));