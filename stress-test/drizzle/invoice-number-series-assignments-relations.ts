import { relations } from "drizzle-orm";
import { invoiceNumberSeriesAssignments } from "./invoice-number-series-assignments.js";
import { users } from "./users.js";
import { invoiceNumberSeriesDefinitions } from "./invoice-number-series-definitions.js";

export const invoiceNumberSeriesAssignmentsRelations = relations(
  invoiceNumberSeriesAssignments,
  (helpers) => ({
    ownerUser: helpers.one(users, {
      relationName: "InvoiceNumberSeriesAssignmentToUser",
      fields: [invoiceNumberSeriesAssignments.ownerUserId],
      references: [users.id],
    }),
    seriesDefinition: helpers.one(invoiceNumberSeriesDefinitions, {
      relationName:
        "InvoiceNumberSeriesAssignmentToInvoiceNumberSeriesDefinition",
      fields: [invoiceNumberSeriesAssignments.seriesDefinitionId],
      references: [invoiceNumberSeriesDefinitions.id],
    }),
  }),
);
