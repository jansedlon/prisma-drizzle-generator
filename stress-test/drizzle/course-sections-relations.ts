import { relations } from "drizzle-orm";
import { courseSections } from "./course-sections.js";
import { courseModules } from "./course-modules.js";
import { memberCourseSectionProgresses } from "./member-course-section-progresses.js";

export const courseSectionsRelations = relations(courseSections, (helpers) => ({
  module: helpers.one(courseModules, {
    relationName: "CourseModuleToCourseSection",
    fields: [courseSections.moduleId],
    references: [courseModules.id],
  }),
  progress: helpers.many(memberCourseSectionProgresses, {
    relationName: "CourseSectionToMemberCourseSectionProgress",
  }),
}));
