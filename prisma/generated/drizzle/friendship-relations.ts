import { relations } from 'drizzle-orm';
import { friendship } from './friendship-schema.js';
import { user } from './user-schema.js';

export const friendshipRelations = relations(friendship, ({ one, many }) => ({
  userFriends: many(friendship),
  friendOfUsers: many(friendship),
  userFriends: one(user, {
    fields: [friendship.userId],
    references: [user.id],
    onDelete: 'cascade',
    
  }),
  friendOfUser: one(user, {
    fields: [friendship.friendId],
    references: [user.id],
    onDelete: 'cascade',
    
  })
}));