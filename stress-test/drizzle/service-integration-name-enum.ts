import { pgEnum } from "drizzle-orm/pg-core";

export const serviceIntegrationNameEnum = pgEnum("ServiceIntegrationName", [
  "ECOMAIL",
  "MAILER_LITE",
  "FAKTUROID",
  "SMART_EMAILING",
  "FACEBOOK_PIXEL",
  "FACEBOOK_CAPI",
  "TRACKDESK",
  "GOOGLE_CALENDAR",
]);
