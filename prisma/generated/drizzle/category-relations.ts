import { relations } from 'drizzle-orm';
import { category } from './category-schema.js';

export const categoryRelations = relations(category, ({ one, many }) => ({
  parent: one(category, {
    fields: [category.parentId],
    references: [category.id]
  }),
  children: many(category)
}));