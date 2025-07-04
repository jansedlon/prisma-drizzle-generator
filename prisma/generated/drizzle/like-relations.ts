import { relations } from 'drizzle-orm';
import { like } from './like-schema.js';
import { user } from './user-schema.js';
import { post } from './post-schema.js';
import { comment } from './comment-schema.js';

export const likeRelations = relations(like, ({ one, many }) => ({
  user: one(user, {
    fields: [like.userId],
    references: [user.id]
  }),
  post: one(post, {
    fields: [like.postId],
    references: [post.id]
  }),
  comment: one(comment, {
    fields: [like.commentId],
    references: [comment.id]
  })
}));