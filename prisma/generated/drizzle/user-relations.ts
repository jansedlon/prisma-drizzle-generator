import { relations } from 'drizzle-orm';
import { user } from './user-schema.js';
import { userProfile } from './user-profile-schema.js';
import { userSettings } from './user-settings-schema.js';
import { post } from './post-schema.js';
import { comment } from './comment-schema.js';
import { like } from './like-schema.js';
import { notification } from './notification-schema.js';
import { task } from './task-schema.js';
import { teamMember } from './team-member-schema.js';
import { friendship } from './friendship-schema.js';
import { tag } from './tag-schema.js';

export const userRelations = relations(user, ({ one, many }) => ({
  referredBy: one(user, {
    fields: [user.referredById],
    references: [user.id]
  }),
  referrals: many(user),
  profile: one(userProfile),
  userSettings: one(userSettings),
  posts: many(post),
  comments: many(comment),
  likes: many(like),
  notifications: many(notification),
  assignedTasks: many(task),
  memberships: many(teamMember),
  friendships: many(friendship),
  followedTags: many(tag),
  followers: many(tag)
}));