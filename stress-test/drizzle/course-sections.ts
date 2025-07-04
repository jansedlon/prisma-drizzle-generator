import { pgTable, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { courseSectionStatusEnum } from "./course-section-status-enum.js";
import type { CourseSectionAttachment } from "@flixydev/flixy-types/prisma";

export const courseSections = pgTable("CourseSection", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  status: courseSectionStatusEnum("status").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  videoLink: text("videoLink"),
  position: integer("position").notNull(),
  attachments: jsonb("attachments")
    .array()
    .$type<CourseSectionAttachment>()
    .notNull(),
  moduleId: text("moduleId").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  deletedAt: timestamp("deletedAt", { mode: "date", precision: 3 }),
});
