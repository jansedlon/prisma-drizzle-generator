import { relations } from "drizzle-orm";
import { courses } from "./courses.js";
import { storeProducts } from "./store-products.js";
import { stores } from "./stores.js";
import { courseModules } from "./course-modules.js";
import { courseToCommunities } from "./course-to-communities.js";
import { memberToCourses } from "./member-to-courses.js";
import { memberCourseSectionProgresses } from "./member-course-section-progresses.js";
import { courseInvitations } from "./course-invitations.js";

export const coursesRelations = relations(courses, (helpers) => ({
  storeProduct: helpers.one(storeProducts, {
    relationName: "CourseToStoreProduct",
    fields: [courses.storeProductId],
    references: [storeProducts.id],
  }),
  store: helpers.one(stores, {
    relationName: "CourseToStore",
    fields: [courses.storeId],
    references: [stores.id],
  }),
  modules: helpers.many(courseModules, {
    relationName: "CourseToCourseModule",
  }),
  courseToCommunities: helpers.many(courseToCommunities, {
    relationName: "CourseToCourseToCommunity",
  }),
  membersToCourse: helpers.many(memberToCourses, {
    relationName: "CourseToMemberToCourse",
  }),
  progress: helpers.many(memberCourseSectionProgresses, {
    relationName: "CourseToMemberCourseSectionProgress",
  }),
  invitations: helpers.many(courseInvitations, {
    relationName: "CourseToCourseInvitation",
  }),
}));
