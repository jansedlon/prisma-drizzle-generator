import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const funnelSteps = pgTable("FunnelStep", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  isEntryPoint: boolean("isEntryPoint").default(false).notNull(),
  funnelId: text("funnelId").notNull(),
  productId: text("productId").notNull(),
  nextStepAcceptId: text("nextStepAcceptId"),
  nextStepDeclineId: text("nextStepDeclineId"),
  orderPosition: integer("orderPosition").default(999).notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  deletedAt: timestamp("deletedAt", { mode: "date", precision: 3 }),
});
