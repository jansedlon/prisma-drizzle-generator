import { relations } from 'drizzle-orm';
import { tag } from './tag-schema.js';
import { user } from './user-schema.js';
import { post } from './post-schema.js';

export const tagRelations = relations(tag, ({ one, many }) => ({
  followedTags: many(user),
  tags: many(post),
  posts: many(post),
  followers: many(user)
}));