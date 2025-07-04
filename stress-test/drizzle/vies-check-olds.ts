import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const viesCheckOlds = pgTable("ViesCheck", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  vatNumber: text("vatNumber"),
  countryCode: text("countryCode"),
  requesterNumber: text("requesterNumber"),
  requesterMemberStateCode: text("requesterMemberStateCode"),
  requestIdentifier: text("requestIdentifier"),
  isValid: boolean("isValid").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
});
