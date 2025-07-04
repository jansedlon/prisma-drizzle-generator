import { relations } from 'drizzle-orm';
import { post } from './post-schema.js';
import { user } from './user-schema.js';
import { category } from './category-schema.js';
import { comment } from './comment-schema.js';
import { like } from './like-schema.js';
import { tag } from './tag-schema.js';

export const postRelations = relations(post, ({ one, many }) => ({
  author: one(user, {
    fields: [post.authorId],
    references: [user.id]
  }),
  category: one(category, {
    fields: [post.categoryId],
    references: [category.id]
  }),
  comments: many(comment),
  likes: many(like),
  tags: many(tag)
}));