import { relations } from 'drizzle-orm';
import { comment } from './comment-schema.js';
import { user } from './user-schema.js';
import { post } from './post-schema.js';

export const commentRelations = relations(comment, ({ one, many }) => ({
  comments: many(user),
  parent: one(comment, {
    fields: [comment.parentId],
    references: [comment.id]
  }),
  children: many(comment),
  post: one(post, {
    fields: [comment.postId],
    references: [post.id]
  }),
  author: one(user, {
    fields: [comment.authorId],
    references: [user.id]
  })
}));