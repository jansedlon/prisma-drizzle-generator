import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import type { CourseSectionAttachment } from "@flixydev/flixy-types/prisma";

export const courses = pgTable("Course", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  icon: text("icon"),
  banner: text("banner"),
  introductionTitle: text("introductionTitle"),
  introductionContent: text("introductionContent"),
  introductionVideo: text("introductionVideo"),
  introductionResources: jsonb("introductionResources")
    .array()
    .$type<CourseSectionAttachment>()
    .notNull(),
  storeProductId: text("storeProductId"),
  storeId: text("storeId").notNull(),
  deletedAt: timestamp("deletedAt", { mode: "date", precision: 3 }),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
