import { pgEnum } from "drizzle-orm/pg-core";

export const emailStatusEnum = pgEnum("EmailStatus", ["SENT", "FAILED"]);
