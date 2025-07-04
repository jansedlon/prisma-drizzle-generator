import { pgEnum } from "drizzle-orm/pg-core";

export const transactionsReportStatusEnum = pgEnum("TransactionsReportStatus", [
  "PENDING",
  "STARTED",
  "GENERATED",
  "FAILED",
]);
