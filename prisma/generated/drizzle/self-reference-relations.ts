import { relations } from 'drizzle-orm';
import { selfReference } from './self-reference-schema.js';

export const selfReferenceRelations = relations(selfReference, ({ one, many }) => ({
  selfReference_referringMany: one(selfReference, {
    fields: [selfReference.referringManyId],
    references: [selfReference.id],
    
    
  }),
  selfReference_referringManys: many(selfReference),
  selfReference_referringUnique: one(selfReference, {
    fields: [selfReference.referringUniqueId],
    references: [selfReference.id],
    
    
  })
}));