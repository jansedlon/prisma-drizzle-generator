import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const countries = pgTable("Country", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  localName: text("localName").notNull(),
  phone: integer("phone"),
  languages: text("languages").array().notNull(),
  flagEmoji: text("flagEmoji").notNull(),
  code: text("alpha2").notNull(),
  isEU: boolean("isEU").default(false).notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
