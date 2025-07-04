import { relations } from 'drizzle-orm';
import { oneToOne_A } from './one-to-one_-a-schema.js';
import { oneToOne_B } from './one-to-one_-b-schema.js';

export const oneToOne_ARelations = relations(oneToOne_A, ({ one, many }) => ({
  oneToOne_AToOneToOne_B: one(oneToOne_B, {
    fields: [oneToOne_A.bId],
    references: [oneToOne_B.id],
    
    
  })
}));