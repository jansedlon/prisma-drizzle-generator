import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { suppressionListTypeEnum } from "./suppression-list-type-enum.js";

export const suppressionLists = pgTable("SuppressionList", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  email: text("email").notNull(),
  type: suppressionListTypeEnum("type").notNull(),
  reason: text("reason"),
  bounceSubType: text("bounceSubType"),
  softBounceCount: integer("softBounceCount").default(0).notNull(),
  lastBounceAt: timestamp("lastBounceAt", { mode: "date", precision: 3 }),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .$onUpdateFn(() => new Date())
    .notNull(),
});
