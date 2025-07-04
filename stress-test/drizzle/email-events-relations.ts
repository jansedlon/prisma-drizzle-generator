import { relations } from "drizzle-orm";
import { emailEvents } from "./email-events.js";
import { emails } from "./emails.js";

export const emailEventsRelations = relations(emailEvents, (helpers) => ({
  email: helpers.one(emails, {
    relationName: "EmailToEmailEvent",
    fields: [emailEvents.emailId],
    references: [emails.id],
  }),
}));
