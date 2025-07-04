import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { memberCommunityLayoutPreferenceEnum } from "./member-community-layout-preference-enum.js";

export const members = pgTable("Member", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  email: text("email").notNull(),
  userId: text("userId").notNull(),
  name: text("name").notNull(),
  profilePicture: text("profilePicture"),
  bio: text("bio"),
  communityLayoutPreference: memberCommunityLayoutPreferenceEnum(
    "communityLayoutPreference",
  )
    .default("SIDEBAR")
    .notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
