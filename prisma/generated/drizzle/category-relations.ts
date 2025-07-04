import { relations } from 'drizzle-orm';
import { category } from './category-schema.js';
import { post } from './post-schema.js';

export const categoryRelations = relations(category, ({ one, many }) => ({
  categoryHierarchy: one(category, {
    fields: [category.parentId],
    references: [category.id],
    
    
  }),
  categoryHierarchys: many(category),
  categoryToPosts: many(post)
}));