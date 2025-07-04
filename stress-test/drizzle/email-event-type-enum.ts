import { pgEnum } from "drizzle-orm/pg-core";

export const emailEventTypeEnum = pgEnum("EmailEventType", [
  "SENT",
  "DELIVERED",
  "BOUNCED",
  "COMPLAINT",
  "OPENED",
  "CLICKED",
]);
