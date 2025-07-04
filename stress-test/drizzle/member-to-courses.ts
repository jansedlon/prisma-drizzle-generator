import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { memberToCourseAccessedFromEnum } from "./member-to-course-accessed-from-enum.js";

export const memberToCourses = pgTable("MemberToCourse", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  memberId: text("memberId"),
  courseId: text("courseId").notNull(),
  userId: text("userId").notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  accessedFrom: memberToCourseAccessedFromEnum("accessedFrom").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
});
