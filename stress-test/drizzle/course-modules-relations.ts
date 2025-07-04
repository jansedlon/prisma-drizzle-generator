import { relations } from "drizzle-orm";
import { courseModules } from "./course-modules.js";
import { courses } from "./courses.js";
import { courseSections } from "./course-sections.js";

export const courseModulesRelations = relations(courseModules, (helpers) => ({
  course: helpers.one(courses, {
    relationName: "CourseToCourseModule",
    fields: [courseModules.courseId],
    references: [courses.id],
  }),
  sections: helpers.many(courseSections, {
    relationName: "CourseModuleToCourseSection",
  }),
}));
