import { pgEnum } from "drizzle-orm/pg-core";

export const courseToCommunityAccessTypeEnum = pgEnum(
  "CourseToCommunityAccessType",
  ["FREE", "PAID"],
);
