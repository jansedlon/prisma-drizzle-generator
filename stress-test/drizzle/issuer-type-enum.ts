import { pgEnum } from "drizzle-orm/pg-core";

export const issuerTypeEnum = pgEnum("IssuerType", [
  "FLIXY",
  "USER",
  "EXTERNAL",
  "MANUAL",
]);
