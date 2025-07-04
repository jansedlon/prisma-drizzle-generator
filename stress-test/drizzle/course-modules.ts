import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { courseModuleStatusEnum } from "./course-module-status-enum.js";

export const courseModules = pgTable("CourseModule", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  title: text("title").notNull(),
  courseId: text("courseId").notNull(),
  status: courseModuleStatusEnum("status").notNull(),
  position: integer("position").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  deletedAt: timestamp("deletedAt", { mode: "date", precision: 3 }),
});
