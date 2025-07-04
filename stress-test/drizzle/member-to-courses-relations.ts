import { relations } from "drizzle-orm";
import { memberToCourses } from "./member-to-courses.js";
import { members } from "./members.js";
import { users } from "./users.js";
import { courses } from "./courses.js";
import { courseInvitations } from "./course-invitations.js";

export const memberToCoursesRelations = relations(
  memberToCourses,
  (helpers) => ({
    member: helpers.one(members, {
      relationName: "MemberToMemberToCourse",
      fields: [memberToCourses.memberId],
      references: [members.id],
    }),
    user: helpers.one(users, {
      relationName: "MemberToCourseToUser",
      fields: [memberToCourses.userId],
      references: [users.id],
    }),
    course: helpers.one(courses, {
      relationName: "CourseToMemberToCourse",
      fields: [memberToCourses.courseId],
      references: [courses.id],
    }),
    invitations: helpers.many(courseInvitations, {
      relationName: "CourseInvitationToMemberToCourse",
    }),
  }),
);
