import { relations } from "drizzle-orm";
import { invoiceNumberSeriesDefinitions } from "./invoice-number-series-definitions.js";
import { users } from "./users.js";
import { invoiceNumberSeriesSequences } from "./invoice-number-series-sequences.js";
import { invoiceNumberSeriesAssignments } from "./invoice-number-series-assignments.js";

export const invoiceNumberSeriesDefinitionsRelations = relations(
  invoiceNumberSeriesDefinitions,
  (helpers) => ({
    ownerUser: helpers.one(users, {
      relationName: "InvoiceNumberSeriesDefinitionToUser",
      fields: [invoiceNumberSeriesDefinitions.ownerUserId],
      references: [users.id],
    }),
    sequences: helpers.many(invoiceNumberSeriesSequences, {
      relationName:
        "InvoiceNumberSeriesDefinitionToInvoiceNumberSeriesSequence",
    }),
    assignments: helpers.many(invoiceNumberSeriesAssignments, {
      relationName:
        "InvoiceNumberSeriesAssignmentToInvoiceNumberSeriesDefinition",
    }),
  }),
);
