import { pgEnum } from "drizzle-orm/pg-core";

export const courseModuleStatusEnum = pgEnum("CourseModuleStatus", [
  "PUBLISHED",
  "DRAFT",
]);
