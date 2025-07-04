import { pgTable, text, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { userRoleEnum } from "./user-role-enum.js";
import { memberCommunityLayoutPreferenceEnum } from "./member-community-layout-preference-enum.js";
import type {
  UserStripeDueRequirements,
  UserSocialLinks,
  Preferences,
} from "@flixydev/flixy-types/prisma";

export const users = pgTable("User", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  email: text("email").notNull(),
  username: text("username"),
  roles: userRoleEnum("roles").array().notNull(),
  role: userRoleEnum("role").default("USER").notNull(),
  currencyCode: text("currencyCode"),
  name: text("name").notNull(),
  vat: text("vat"),
  localIdentificationNumber: text("localIdentificationNumber"),
  phoneNumber: text("phoneNumber"),
  stripeCustomerId: text("stripeCustomerId"),
  countryId: text("countryId"),
  billingCountryId: text("billingCountryId"),
  activeLanguageId: text("activeLanguageId").notNull(),
  hasTrial: boolean("hasTrial").default(false).notNull(),
  stripeConnectAccountId: text("stripeConnectAccountId"),
  communityLayoutPreference: memberCommunityLayoutPreferenceEnum(
    "communityLayoutPreference",
  )
    .default("SIDEBAR")
    .notNull(),
  stripeCurrentlyDueRequirements: jsonb(
    "stripeCurrentlyDueRequirements",
  ).$type<UserStripeDueRequirements>(),
  stripeDetailsSubmitted: boolean("stripeDetailsSubmitted")
    .default(false)
    .notNull(),
  dateOfBirth: timestamp("dateOfBirth", { mode: "date", precision: 3 }),
  lastLoggedAt: timestamp("lastLoggedAt", { mode: "date", precision: 3 }),
  addressId: text("addressId"),
  profilePicture: text("profilePicture"),
  bio: text("bio"),
  referrerId: text("referrerId"),
  socialLinks: jsonb("socialLinks").$type<UserSocialLinks>(),
  onboardingDepositSkipped: boolean("onboardingDepositSkipped")
    .default(false)
    .notNull(),
  onboardingCompleted: boolean("onboardingCompleted").default(false).notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  deletedAt: timestamp("deletedAt", { mode: "date", precision: 3 }),
  preferences: jsonb("preferences").$type<Preferences>().default({}).notNull(),
});
