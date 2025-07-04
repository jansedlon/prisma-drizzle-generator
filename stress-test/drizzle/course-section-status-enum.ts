import { pgEnum } from "drizzle-orm/pg-core";

export const courseSectionStatusEnum = pgEnum("CourseSectionStatus", [
  "PUBLISHED",
  "DRAFT",
]);
