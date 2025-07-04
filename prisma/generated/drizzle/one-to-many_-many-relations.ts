import { relations } from 'drizzle-orm';
import { oneToMany_Many } from './one-to-many_-many-schema.js';
import { oneToMany_One } from './one-to-many_-one-schema.js';

export const oneToMany_ManyRelations = relations(oneToMany_Many, ({ one, many }) => ({
  oneToMany_ManyToOneToMany_Ones: many(oneToMany_One)
}));