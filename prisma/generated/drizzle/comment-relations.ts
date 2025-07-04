import { relations } from 'drizzle-orm';
import { comment } from './comment-schema.js';
import { user } from './user-schema.js';
import { post } from './post-schema.js';
import { like } from './like-schema.js';

export const commentRelations = relations(comment, ({ one, many }) => ({
  commentToUsers: many(comment),
  commentToPosts: many(comment),
  commentReplies: one(comment, {
    fields: [comment.parentId],
    references: [comment.id],
    
    
  }),
  commentReplies: many(comment),
  commentToPost: one(post, {
    fields: [comment.postId],
    references: [post.id],
    onDelete: 'cascade',
    
  }),
  commentToUser: one(user, {
    fields: [comment.authorId],
    references: [user.id],
    onDelete: 'cascade',
    
  }),
  commentToLikes: many(like)
}));