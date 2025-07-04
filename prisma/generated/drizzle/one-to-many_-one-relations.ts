import { relations } from 'drizzle-orm';
import { oneToMany_One } from './one-to-many_-one-schema.js';
import { oneToMany_Many } from './one-to-many_-many-schema.js';

export const oneToMany_OneRelations = relations(oneToMany_One, ({ one, many }) => ({
  oneToMany_ManyToOneToMany_One: one(oneToMany_Many, {
    fields: [oneToMany_One.manyId],
    references: [oneToMany_Many.id],
    
    
  }),
  oneToMany_ManyToOneToMany_Ones: many(oneToMany_One)
}));