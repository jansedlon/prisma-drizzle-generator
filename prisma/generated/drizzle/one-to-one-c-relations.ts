import { relations } from 'drizzle-orm';
import { oneToOne_C } from './one-to-one-c-schema.js';
import { oneToOne_B } from './one-to-one-b-schema.js';

export const oneToOne_CRelations = relations(oneToOne_C, ({ one, many }) => ({
  oneToOne_BToOneToOne_C: one(oneToOne_B, {
    fields: [oneToOne_C.bId],
    references: [oneToOne_B.id],
    
    
  })
}));