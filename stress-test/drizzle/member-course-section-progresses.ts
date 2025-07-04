import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const memberCourseSectionProgresses = pgTable(
  "MemberCourseSectionProgress",
  {
    courseId: text("courseId").notNull(),
    sectionId: text("sectionId").notNull(),
    memberId: text("memberId"),
    completedAt: timestamp("completedAt", { mode: "date", precision: 3 }),
    userId: text("userId").notNull(),
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
);
