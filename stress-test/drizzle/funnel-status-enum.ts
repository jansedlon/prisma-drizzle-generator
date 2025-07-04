import { pgEnum } from "drizzle-orm/pg-core";

export const funnelStatusEnum = pgEnum("FunnelStatus", [
  "DRAFT",
  "ACTIVE",
  "ARCHIVED",
]);
