import { pgEnum } from "drizzle-orm/pg-core";

export const googleCalendarAccountStatusEnum = pgEnum(
  "GoogleCalendarAccountStatus",
  ["SYNCHRONIZING", "SYNCHRONIZED", "ERROR"],
);
