import { pgEnum } from "drizzle-orm/pg-core";

export const storeCustomDomainStatusEnum = pgEnum("StoreCustomDomainStatus", [
  "PENDING_VERIFICATION",
  "VERIFIED",
  "FAILED",
]);
