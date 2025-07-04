import { relations } from "drizzle-orm";
import { emails } from "./emails.js";
import { emailEvents } from "./email-events.js";

export const emailsRelations = relations(emails, (helpers) => ({
  events: helpers.many(emailEvents, { relationName: "EmailToEmailEvent" }),
}));
