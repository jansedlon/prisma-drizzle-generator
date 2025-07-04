import { relations } from 'drizzle-orm';
import { teamMember } from './team-member-schema.js';
import { user } from './user-schema.js';
import { team } from './team-schema.js';

export const teamMemberRelations = relations(teamMember, ({ one, many }) => ({
  memberships: many(user),
  members: many(team),
  team: one(team, {
    fields: [teamMember.teamId],
    references: [team.id]
  }),
  user: one(user, {
    fields: [teamMember.userId],
    references: [user.id]
  })
}));