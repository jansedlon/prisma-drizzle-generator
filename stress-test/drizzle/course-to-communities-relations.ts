import { relations } from "drizzle-orm";
import { courseToCommunities } from "./course-to-communities.js";
import { storeProducts } from "./store-products.js";
import { courses } from "./courses.js";
import { communities } from "./communities.js";

export const courseToCommunitiesRelations = relations(
  courseToCommunities,
  (helpers) => ({
    storeProduct: helpers.one(storeProducts, {
      relationName: "CourseToCommunityToStoreProduct",
      fields: [courseToCommunities.storeProductId],
      references: [storeProducts.id],
    }),
    course: helpers.one(courses, {
      relationName: "CourseToCourseToCommunity",
      fields: [courseToCommunities.courseId],
      references: [courses.id],
    }),
    community: helpers.one(communities, {
      relationName: "CommunityToCourseToCommunity",
      fields: [courseToCommunities.communityId],
      references: [communities.id],
    }),
  }),
);
