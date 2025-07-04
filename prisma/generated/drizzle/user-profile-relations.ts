import { relations } from 'drizzle-orm';
import { userProfile } from './user-profile-schema.js';
import { user } from './user-schema.js';

export const userProfileRelations = relations(userProfile, ({ one, many }) => ({
  userToUserProfile: one(user, {
    fields: [userProfile.userId],
    references: [user.id]
  })
}));