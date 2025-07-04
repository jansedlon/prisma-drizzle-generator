import { relations } from "drizzle-orm";
import { invoiceNumberSeriesSequences } from "./invoice-number-series-sequences.js";
import { invoiceNumberSeriesDefinitions } from "./invoice-number-series-definitions.js";

export const invoiceNumberSeriesSequencesRelations = relations(
  invoiceNumberSeriesSequences,
  (helpers) => ({
    seriesDefinition: helpers.one(invoiceNumberSeriesDefinitions, {
      relationName:
        "InvoiceNumberSeriesDefinitionToInvoiceNumberSeriesSequence",
      fields: [invoiceNumberSeriesSequences.seriesDefinitionId],
      references: [invoiceNumberSeriesDefinitions.id],
    }),
  }),
);
