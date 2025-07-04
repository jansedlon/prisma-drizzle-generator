import { pgEnum } from "drizzle-orm/pg-core";

export const memberToCourseAccessedFromEnum = pgEnum(
  "MemberToCourseAccessedFrom",
  ["PURCHASE", "COMMUNITY"],
);
