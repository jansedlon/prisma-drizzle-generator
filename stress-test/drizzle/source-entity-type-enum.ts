import { pgEnum } from "drizzle-orm/pg-core";

export const sourceEntityTypeEnum = pgEnum("SourceEntityType", [
  "STRIPE_PLATFORM_INVOICE",
  "STORE_ORDER",
  "MANUAL_INPUT",
]);
