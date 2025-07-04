import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { discountCodeTypeEnum } from "./discount-code-type-enum.js";

export const discountCodes = pgTable("DiscountCode", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  discountAmount: integer("discountAmount").notNull(),
  currencyCode: text("currencyCode").notNull(),
  discountType: discountCodeTypeEnum("discountType").notNull(),
  validFrom: timestamp("validFrom", { mode: "date", precision: 3 }).notNull(),
  validUntil: timestamp("validUntil", { mode: "date", precision: 3 }),
  isActive: boolean("isActive").default(true).notNull(),
  allProducts: boolean("allProducts").default(false).notNull(),
  maxUses: integer("maxUses"),
  uses: integer("uses").default(0).notNull(),
  storeId: text("storeId").notNull(),
  deletedAt: timestamp("deletedAt", { mode: "date", precision: 3 }),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
