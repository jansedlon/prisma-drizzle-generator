import { relations } from 'drizzle-orm';
import { post } from './post-schema.js';
import { user } from './user-schema.js';
import { category } from './category-schema.js';
import { comment } from './comment-schema.js';
import { like } from './like-schema.js';

export const postRelations = relations(post, ({ one, many }) => ({
  postToUsers: many(post),
  categoryToPosts: many(post),
  postToUser: one(user, {
    fields: [post.authorId],
    references: [user.id],
    onDelete: 'cascade',
    
  }),
  categoryToPost: one(category, {
    fields: [post.categoryId],
    references: [category.id],
    onDelete: 'setNull',
    
  }),
  commentToPosts: many(comment),
  likeToPosts: many(like)
}));