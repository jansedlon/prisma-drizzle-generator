import { relations } from "drizzle-orm";
import { postAttachments } from "./post-attachments.js";
import { posts } from "./posts.js";

export const postAttachmentsRelations = relations(
  postAttachments,
  (helpers) => ({
    post: helpers.one(posts, {
      relationName: "PostToPostAttachment",
      fields: [postAttachments.postId],
      references: [posts.id],
    }),
  }),
);
