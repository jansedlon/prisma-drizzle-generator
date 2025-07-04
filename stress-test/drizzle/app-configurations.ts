import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const appConfigurations = pgTable("AppConfiguration", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  afterSignupSubscriptionPriceId: text("afterSignupSubscriptionPriceId"),
  flixyStoreId: text("flixyStoreId"),
  profitAcceleratorProductIds: text("profitAcceleratorProductIds")
    .array()
    .notNull(),
  profitAcceleratorCommunityId: text("profitAcceleratorCommunityId"),
  profitAcceleratorProPostCategories: text("profitAcceleratorProPostCategories")
    .array()
    .notNull(),
  profitAcceleratorProBetaProductId: text("profitAcceleratorProBetaProductId"),
  allowedPricesToUpgradeToProfitAcceleratorPro: text(
    "allowedPricesToUpgradeToProfitAcceleratorPro",
  )
    .array()
    .notNull(),
  profitAcceleratorProCourses: text("profitAcceleratorProCourses")
    .array()
    .notNull(),
  profitAcceleratorFreeSubscriptionPriceId: text(
    "profitAcceleratorFreeSubscriptionPriceId",
  ),
  profitAcceleratorWebinarCourses: text("profitAcceleratorWebinarCourses")
    .array()
    .notNull(),
  profitAcceleratorCoursesPriceId: text("profitAcceleratorCoursesPriceId"),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
