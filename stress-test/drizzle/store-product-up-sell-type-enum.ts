import { pgEnum } from "drizzle-orm/pg-core";

export const storeProductUpSellTypeEnum = pgEnum("StoreProductUpSellType", [
  "FILE",
  "URL",
  "NONE",
  "COURSES",
]);
