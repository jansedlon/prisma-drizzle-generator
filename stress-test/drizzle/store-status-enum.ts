import { pgEnum } from "drizzle-orm/pg-core";

export const storeStatusEnum = pgEnum("StoreStatus", ["PUBLISHED", "INACTIVE"]);
