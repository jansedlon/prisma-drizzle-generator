import { pgEnum } from "drizzle-orm/pg-core";

export const storePageStatusEnum = pgEnum("StorePageStatus", [
  "PUBLISHED",
  "DRAFT",
  "UNLISTED",
  "SPECIAL",
]);
