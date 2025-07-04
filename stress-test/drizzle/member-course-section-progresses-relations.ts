import { relations } from "drizzle-orm";
import { memberCourseSectionProgresses } from "./member-course-section-progresses.js";
import { courses } from "./courses.js";
import { courseSections } from "./course-sections.js";
import { members } from "./members.js";
import { users } from "./users.js";

export const memberCourseSectionProgressesRelations = relations(
  memberCourseSectionProgresses,
  (helpers) => ({
    course: helpers.one(courses, {
      relationName: "CourseToMemberCourseSectionProgress",
      fields: [memberCourseSectionProgresses.courseId],
      references: [courses.id],
    }),
    section: helpers.one(courseSections, {
      relationName: "CourseSectionToMemberCourseSectionProgress",
      fields: [memberCourseSectionProgresses.sectionId],
      references: [courseSections.id],
    }),
    member: helpers.one(members, {
      relationName: "MemberToMemberCourseSectionProgress",
      fields: [memberCourseSectionProgresses.memberId],
      references: [members.id],
    }),
    user: helpers.one(users, {
      relationName: "MemberCourseSectionProgressToUser",
      fields: [memberCourseSectionProgresses.userId],
      references: [users.id],
    }),
  }),
);
