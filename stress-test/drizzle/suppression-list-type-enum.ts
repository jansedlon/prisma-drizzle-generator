import { pgEnum } from "drizzle-orm/pg-core";

export const suppressionListTypeEnum = pgEnum("SuppressionListType", [
  "HARD_BOUNCE",
  "SOFT_BOUNCE",
  "COMPLAINT",
  "MANUAL",
  "SUPPRESSION_LIST",
]);
