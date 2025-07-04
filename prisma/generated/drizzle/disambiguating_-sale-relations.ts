import { relations } from 'drizzle-orm';
import { disambiguating_Sale } from './disambiguating_-sale-schema.js';
import { disambiguating_Transfer } from './disambiguating_-transfer-schema.js';

export const disambiguating_SaleRelations = relations(disambiguating_Sale, ({ one, many }) => ({
  disambiguating_Sale_payment: one(disambiguating_Transfer, {
    fields: [disambiguating_Sale.paymentId],
    references: [disambiguating_Transfer.id],
    
    
  }),
  disambiguating_Sale_tax: one(disambiguating_Transfer, {
    fields: [disambiguating_Sale.taxId],
    references: [disambiguating_Transfer.id],
    
    
  })
}));