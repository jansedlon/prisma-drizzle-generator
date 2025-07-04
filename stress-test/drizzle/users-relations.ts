import { relations } from "drizzle-orm";
import { users } from "./users.js";
import { passwords } from "./passwords.js";
import { currencies } from "./currencies.js";
import { countries } from "./countries.js";
import { languages } from "./languages.js";
import { addresses } from "./addresses.js";
import { invoicingSettings } from "./invoicing-settings.js";
import { storeCustomers } from "./store-customers.js";
import { userSaleInvoices } from "./user-sale-invoices.js";
import { sessions } from "./sessions.js";
import { subscriptions } from "./subscriptions.js";
import { userInvoices } from "./user-invoices.js";
import { userNotificationPreferences } from "./user-notification-preferences.js";
import { storeToUsers } from "./store-to-users.js";
import { authenticators } from "./authenticators.js";
import { referrerSettings } from "./referrer-settings.js";
import { usersOnServiceIntegrations } from "./users-on-service-integrations.js";
import { referrerIncomes } from "./referrer-incomes.js";
import { members } from "./members.js";
import { feedbacks } from "./feedbacks.js";
import { googleCalendarAccounts } from "./google-calendar-accounts.js";
import { googleCalendars } from "./google-calendars.js";
import { userFeatureFlags } from "./user-feature-flags.js";
import { invoices } from "./invoices.js";
import { userSubscriptionProductV2S } from "./user-subscription-product-v-2-s.js";
import { memberToCommunities } from "./member-to-communities.js";
import { posts } from "./posts.js";
import { postLikes } from "./post-likes.js";
import { postComments } from "./post-comments.js";
import { commentLikes } from "./comment-likes.js";
import { memberToChats } from "./member-to-chats.js";
import { chatMessages } from "./chat-messages.js";
import { memberToCourses } from "./member-to-courses.js";
import { memberCourseSectionProgresses } from "./member-course-section-progresses.js";
import { communityNotifications } from "./community-notifications.js";
import { events } from "./events.js";
import { notificationSettings } from "./notification-settings.js";
import { invoiceV2S } from "./invoice-v-2-s.js";
import { invoiceNumberSeriesDefinitions } from "./invoice-number-series-definitions.js";
import { invoiceNumberSeriesAssignments } from "./invoice-number-series-assignments.js";
import { userSaleInvoiceCounters } from "./user-sale-invoice-counters.js";

export const usersRelations = relations(users, (helpers) => ({
  password: helpers.one(passwords),
  currency: helpers.one(currencies, {
    relationName: "CurrencyToUser",
    fields: [users.currencyCode],
    references: [currencies.code],
  }),
  country: helpers.one(countries, {
    relationName: "UserToCountry",
    fields: [users.countryId],
    references: [countries.id],
  }),
  billingCountry: helpers.one(countries, {
    relationName: "UserToCountryBilling",
    fields: [users.billingCountryId],
    references: [countries.id],
  }),
  activeLanguage: helpers.one(languages, {
    relationName: "LanguageToUser",
    fields: [users.activeLanguageId],
    references: [languages.id],
  }),
  address: helpers.one(addresses, {
    relationName: "AddressToUser",
    fields: [users.addressId],
    references: [addresses.id],
  }),
  invoicingSettings: helpers.one(invoicingSettings),
  referrer: helpers.one(users, {
    relationName: "UserReferrer",
    fields: [users.referrerId],
    references: [users.id],
  }),
  storeCustomers: helpers.many(storeCustomers, {
    relationName: "StoreCustomerToUser",
  }),
  saleInvoices: helpers.many(userSaleInvoices, {
    relationName: "UserToUserSaleInvoice",
  }),
  sessions: helpers.many(sessions, { relationName: "SessionToUser" }),
  subscriptions: helpers.many(subscriptions, {
    relationName: "SubscriptionToUser",
  }),
  subscriptionInvoices: helpers.many(userInvoices, {
    relationName: "UserToUserInvoice",
  }),
  notificationPreferences: helpers.many(userNotificationPreferences, {
    relationName: "UserToUserNotificationPreference",
  }),
  stores: helpers.many(storeToUsers, { relationName: "StoreToUserToUser" }),
  authenticators: helpers.many(authenticators, {
    relationName: "AuthenticatorToUser",
  }),
  referredUsers: helpers.many(users, { relationName: "UserReferrer" }),
  referrerSettings: helpers.one(referrerSettings),
  integrations: helpers.many(usersOnServiceIntegrations, {
    relationName: "UserToUsersOnServiceIntegrations",
  }),
  referrerIncomes: helpers.many(referrerIncomes, {
    relationName: "ReferrerIncomesToUser",
  }),
  member: helpers.one(members),
  feedback: helpers.many(feedbacks, { relationName: "FeedbackToUser" }),
  googleCalendarAccounts: helpers.many(googleCalendarAccounts, {
    relationName: "GoogleCalendarAccountToUser",
  }),
  googleCalendars: helpers.many(googleCalendars, {
    relationName: "GoogleCalendarToUser",
  }),
  featureFlags: helpers.many(userFeatureFlags, {
    relationName: "UserToUserFeatureFlag",
  }),
  invoices: helpers.many(invoices, { relationName: "InvoiceToUser" }),
  subscriptionsV2: helpers.many(userSubscriptionProductV2S, {
    relationName: "UserToUserSubscriptionProductV2",
  }),
  communities: helpers.many(memberToCommunities, {
    relationName: "MemberToCommunityToUser",
  }),
  posts: helpers.many(posts, { relationName: "PostToUser" }),
  postLikes: helpers.many(postLikes, { relationName: "PostLikeToUser" }),
  comments: helpers.many(postComments, { relationName: "PostCommentToUser" }),
  commentLikes: helpers.many(commentLikes, {
    relationName: "CommentLikeToUser",
  }),
  chats: helpers.many(memberToChats, { relationName: "MemberToChatToUser" }),
  messages: helpers.many(chatMessages, { relationName: "ChatMessageToUser" }),
  courses: helpers.many(memberToCourses, {
    relationName: "MemberToCourseToUser",
  }),
  courseSectionProgresses: helpers.many(memberCourseSectionProgresses, {
    relationName: "MemberCourseSectionProgressToUser",
  }),
  communityNotifications: helpers.many(communityNotifications, {
    relationName: "CommunityNotificationToUser",
  }),
  events: helpers.many(events, { relationName: "EventToUser" }),
  notificationSettings: helpers.many(notificationSettings, {
    relationName: "NotificationSettingToUser",
  }),
  referrerIncomesReferee: helpers.many(referrerIncomes, {
    relationName: "ReferrerIncomesSourceUser",
  }),
  issuedInvoices: helpers.many(invoiceV2S, { relationName: "IssuedInvoices" }),
  receivedInvoices: helpers.many(invoiceV2S, {
    relationName: "ReceivedInvoices",
  }),
  invoiceNumberSeriesDefinitions: helpers.many(invoiceNumberSeriesDefinitions, {
    relationName: "InvoiceNumberSeriesDefinitionToUser",
  }),
  invoiceNumberSeriesAssignments: helpers.many(invoiceNumberSeriesAssignments, {
    relationName: "InvoiceNumberSeriesAssignmentToUser",
  }),
  saleInvoiceCounters: helpers.many(userSaleInvoiceCounters, {
    relationName: "UserToUserSaleInvoiceCounter",
  }),
}));
