import { relations } from 'drizzle-orm';
import { tag } from './tag-schema.js';
import { post } from './post-schema.js';
import { user } from './user-schema.js';

export const tagRelations = relations(tag, ({ one, many }) => ({
  posts: many(post),
  followers: many(user)
}));