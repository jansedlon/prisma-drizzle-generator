import { relations } from 'drizzle-orm';
import { user } from './user-schema.js';
import { post } from './post-schema.js';
import { comment } from './comment-schema.js';
import { like } from './like-schema.js';
import { notification } from './notification-schema.js';
import { task } from './task-schema.js';
import { teamMember } from './team-member-schema.js';
import { friendship } from './friendship-schema.js';

export const userRelations = relations(user, ({ one, many }) => ({
  userReferrals: one(user, {
    fields: [user.referredById],
    references: [user.id],
    
    
  }),
  userReferrals: many(user),
  postToUsers: many(post),
  commentToUsers: many(comment),
  likeToUsers: many(like),
  notificationToUsers: many(notification),
  taskToUsers: many(task),
  teamMemberToUsers: many(teamMember),
  userFriends: many(friendship),
  friendOfUsers: many(friendship)
}));