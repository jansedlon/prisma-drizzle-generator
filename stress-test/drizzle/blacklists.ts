import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import type { BlacklistType } from "@flixydev/flixy-types/prisma";

export const blacklists = pgTable("Blacklist", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  type: text("type").$type<BlacklistType>().notNull(),
  value: text("value").notNull(),
  active: boolean("active").default(true).notNull(),
  registerAttempts: integer("registerAttempts").default(0).notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
