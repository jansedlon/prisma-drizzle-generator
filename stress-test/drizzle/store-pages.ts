import {
  pgTable,
  text,
  integer,
  jsonb,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { storePageStatusEnum } from "./store-page-status-enum.js";
import type {
  StorePagePreview,
  CustomerNoticeVariant,
  StorePageFaq,
  StorePageAfterCheckoutData,
} from "@flixydev/flixy-types/prisma";

export const storePages = pgTable("StorePage", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  slug: text("slug"),
  customSlug: text("customSlug"),
  internalName: text("internalName"),
  orderPosition: integer("orderPosition").default(999).notNull(),
  storeId: text("storeId").notNull(),
  url: text("url").notNull(),
  status: storePageStatusEnum("status").notNull(),
  preview: jsonb("preview").$type<StorePagePreview>(),
  submitTitle: text("submitTitle"),
  showPriceDown: boolean("showPriceDown").default(false).notNull(),
  hidePriceOnPreview: boolean("hidePriceOnPreview").default(false).notNull(),
  disableFloatingCheckoutButton: boolean("disableFloatingCheckoutButton")
    .default(false)
    .notNull(),
  disableCallToActionButton: boolean("disableCallToActionButton")
    .default(false)
    .notNull(),
  bottomTitle: text("bottomTitle"),
  video: text("video"),
  embededVideo: text("embededVideo"),
  customerNotice: text("customerNotice"),
  customerNoticeVariant: text(
    "customerNoticeVariant",
  ).$type<CustomerNoticeVariant>(),
  faq: jsonb("faq").$type<StorePageFaq>(),
  afterCheckoutData:
    jsonb("afterCheckoutData").$type<StorePageAfterCheckoutData>(),
  funnelAcceptText: text("funnelAcceptText"),
  funnelDeclineText: text("funnelDeclineText"),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  deletedAt: timestamp("deletedAt", { mode: "date", precision: 3 }),
});
