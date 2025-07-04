import { pgEnum } from "drizzle-orm/pg-core";

export const storeProductTypeEnum = pgEnum("StoreProductType", [
  "CUSTOM_PRODUCT",
  "LEAD_MAGNET",
  "LINK",
  "REFERRAL_LINK",
  "DIGITAL_DOWNLOAD",
  "MEETING",
  "LANDING_PAGE",
  "RECURRING_MEMBERSHIP",
  "DIGITAL_COURSE",
  "MULTI_PAGE_FUNNEL",
]);
