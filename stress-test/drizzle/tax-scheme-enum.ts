import { pgEnum } from "drizzle-orm/pg-core";

export const taxSchemeEnum = pgEnum("TaxScheme", [
  "DOMESTIC",
  "OSS_EU",
  "REVERSE_CHARGE_EU",
  "EXPORT_OUTSIDE_EU",
  "EXEMPT",
  "OUT_OF_SCOPE",
]);
