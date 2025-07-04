import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import type { CourseInvitationStatus } from "@flixydev/flixy-types/prisma";

export const courseInvitations = pgTable("CourseInvitation", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  courseId: text("courseId").notNull(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  expiresAt: timestamp("expiresAt", { mode: "date", precision: 3 }).notNull(),
  status: text("status").$type<CourseInvitationStatus>().notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  memberToCourseId: text("memberToCourseId"),
});
