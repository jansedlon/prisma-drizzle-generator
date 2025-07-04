import { relations } from 'drizzle-orm';
import { friendship } from './friendship-schema.js';
import { user } from './user-schema.js';

export const friendshipRelations = relations(friendship, ({ one, many }) => ({
  user: one(user, {
    fields: [friendship.userId],
    references: [user.id]
  }),
  friend: one(user, {
    fields: [friendship.friendId],
    references: [user.id]
  })
}));