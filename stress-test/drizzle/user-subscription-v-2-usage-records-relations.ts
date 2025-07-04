import { relations } from "drizzle-orm";
import { userSubscriptionV2UsageRecords } from "./user-subscription-v-2-usage-records.js";
import { userSubscriptionV2ProductPrices } from "./user-subscription-v-2-product-prices.js";

export const userSubscriptionV2UsageRecordsRelations = relations(
  userSubscriptionV2UsageRecords,
  (helpers) => ({
    userSubscriptionProductPrice: helpers.one(userSubscriptionV2ProductPrices, {
      relationName:
        "UserSubscriptionV2ProductPriceToUserSubscriptionV2UsageRecord",
      fields: [userSubscriptionV2UsageRecords.userSubscriptionProductPriceId],
      references: [userSubscriptionV2ProductPrices.id],
    }),
  }),
);
