import { pgTable, text, boolean } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const languages = pgTable("Language", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  nativeName: text("nativeName").notNull(),
  englishName: text("englishName").notNull(),
  ISOTwoLetterCode: text("ISOTwoLetterCode").notNull(),
  inUse: boolean("inUse").default(false).notNull(),
});
