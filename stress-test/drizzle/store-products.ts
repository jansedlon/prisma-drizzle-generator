import { pgTable, text, jsonb, integer, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { storeProductTypeEnum } from "./store-product-type-enum.js";
import type {
  StoreProductLeadMagnet,
  StoreProductDigitalDownload,
  StoreProductEmails,
  ProductQuestionsFields,
  StoreProductLink,
  StoreProductReviews,
  StoreProductIntegrationData,
  StoreProductLandingPage,
} from "@flixydev/flixy-types/prisma";

export const storeProducts = pgTable("StoreProduct", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  pageId: text("pageId").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: storeProductTypeEnum("type").notNull(),
  leadMagnet: jsonb("leadMagnet").$type<StoreProductLeadMagnet>(),
  digitalDownload:
    jsonb("digitalDownload").$type<StoreProductDigitalDownload>(),
  emails: jsonb("emails").$type<StoreProductEmails>(),
  productQuestions: jsonb("productQuestions")
    .array()
    .$type<ProductQuestionsFields>()
    .notNull(),
  customVatRate: integer("customVatRate"),
  image: text("image"),
  link: jsonb("link").$type<StoreProductLink>(),
  reviews: jsonb("reviews").$type<StoreProductReviews>(),
  integrationData:
    jsonb("integrationData").$type<StoreProductIntegrationData>(),
  landingPage: jsonb("landingPage").$type<StoreProductLandingPage>(),
  postPurchaseCommunities: text("postPurchaseCommunities").array().notNull(),
  postPurchaseCourses: text("postPurchaseCourses").array().notNull(),
  stripeProductId: text("stripeProductId"),
  stripePriceId: text("stripePriceId"),
  trialPeriodDays: integer("trialPeriodDays"),
  invoiceTitle: text("invoiceTitle"),
  connectedFunnelId: text("connectedFunnelId"),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  deletedAt: timestamp("deletedAt", { mode: "date", precision: 3 }),
});
