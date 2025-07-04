import { pgEnum } from "drizzle-orm/pg-core";

export const discountCodeTypeEnum = pgEnum("DiscountCodeType", [
  "PERCENTAGE",
  "AMOUNT",
]);
