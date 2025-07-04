import { relations } from "drizzle-orm";
import { courseInvitations } from "./course-invitations.js";
import { courses } from "./courses.js";
import { memberToCourses } from "./member-to-courses.js";

export const courseInvitationsRelations = relations(
  courseInvitations,
  (helpers) => ({
    course: helpers.one(courses, {
      relationName: "CourseToCourseInvitation",
      fields: [courseInvitations.courseId],
      references: [courses.id],
    }),
    memberToCourse: helpers.one(memberToCourses, {
      relationName: "CourseInvitationToMemberToCourse",
      fields: [courseInvitations.memberToCourseId],
      references: [memberToCourses.id],
    }),
  }),
);
