import { pgEnum } from "drizzle-orm/pg-core";

export const taxClassificationEnum = pgEnum("TaxClassification", [
  "STANDARD",
  "REDUCED_LOWER",
  "REDUCED_UPPER",
  "ZERO_RATE",
  "EXEMPT",
  "OUT_OF_SCOPE",
]);
