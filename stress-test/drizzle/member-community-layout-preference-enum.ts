import { pgEnum } from "drizzle-orm/pg-core";

export const memberCommunityLayoutPreferenceEnum = pgEnum(
  "MemberCommunityLayoutPreference",
  ["SIDEBAR", "TABS"],
);
