import * as appConfigurations from "./app-configurations.js";
import * as blacklists from "./blacklists.js";
import * as emails from "./emails.js";
import * as emailEvents from "./email-events.js";
import * as suppressionLists from "./suppression-lists.js";
import * as events from "./events.js";
import * as funnels from "./funnels.js";
import * as funnelSteps from "./funnel-steps.js";
import * as invoiceV2S from "./invoice-v-2-s.js";
import * as invoiceV2LineItems from "./invoice-v-2-line-items.js";
import * as invoiceNumberSeriesDefinitions from "./invoice-number-series-definitions.js";
import * as invoiceNumberSeriesAssignments from "./invoice-number-series-assignments.js";
import * as invoiceNumberSeriesSequences from "./invoice-number-series-sequences.js";
import * as users from "./users.js";
import * as referrerSettings from "./referrer-settings.js";
import * as referrerIncomes from "./referrer-incomes.js";
import * as notificationPreferences from "./notification-preferences.js";
import * as userNotificationPreferences from "./user-notification-preferences.js";
import * as passwords from "./passwords.js";
import * as sessions from "./sessions.js";
import * as countries from "./countries.js";
import * as languages from "./languages.js";
import * as verifications from "./verifications.js";
import * as authenticators from "./authenticators.js";
import * as currencies from "./currencies.js";
import * as currencyLocalizations from "./currency-localizations.js";
import * as products from "./products.js";
import * as productLocalizations from "./product-localizations.js";
import * as productPricings from "./product-pricings.js";
import * as subscriptionPlans from "./subscription-plans.js";
import * as userInvoices from "./user-invoices.js";
import * as userInvoiceLineItems from "./user-invoice-line-items.js";
import * as subscriptions from "./subscriptions.js";
import * as addresses from "./addresses.js";
import * as stores from "./stores.js";
import * as storeToUsers from "./store-to-users.js";
import * as storePages from "./store-pages.js";
import * as storeProducts from "./store-products.js";
import * as storeProductUpSells from "./store-product-up-sells.js";
import * as storeProductPrices from "./store-product-prices.js";
import * as meetings from "./meetings.js";
import * as meetingBookings from "./meeting-bookings.js";
import * as meetingAvailabilitySlots from "./meeting-availability-slots.js";
import * as storeOrders from "./store-orders.js";
import * as serviceIntegrations from "./service-integrations.js";
import * as storeThemes from "./store-themes.js";
import * as storeThemeTranslations from "./store-theme-translations.js";
import * as usersOnServiceIntegrations from "./users-on-service-integrations.js";
import * as storeSections from "./store-sections.js";
import * as userSaleInvoices from "./user-sale-invoices.js";
import * as userSaleInvoiceCounters from "./user-sale-invoice-counters.js";
import * as invoicingSettings from "./invoicing-settings.js";
import * as storeProductSubscriptions from "./store-product-subscriptions.js";
import * as members from "./members.js";
import * as memberSessions from "./member-sessions.js";
import * as memberToCommunities from "./member-to-communities.js";
import * as communityInvitations from "./community-invitations.js";
import * as communities from "./communities.js";
import * as notificationSettings from "./notification-settings.js";
import * as communityPostCategories from "./community-post-categories.js";
import * as posts from "./posts.js";
import * as postAttachments from "./post-attachments.js";
import * as postLikes from "./post-likes.js";
import * as postComments from "./post-comments.js";
import * as commentLikes from "./comment-likes.js";
import * as chats from "./chats.js";
import * as memberToChats from "./member-to-chats.js";
import * as chatMessages from "./chat-messages.js";
import * as messageDocuments from "./message-documents.js";
import * as courseInvitations from "./course-invitations.js";
import * as courses from "./courses.js";
import * as courseToCommunities from "./course-to-communities.js";
import * as memberToCourses from "./member-to-courses.js";
import * as courseModules from "./course-modules.js";
import * as courseSections from "./course-sections.js";
import * as memberCourseSectionProgresses from "./member-course-section-progresses.js";
import * as feedbacks from "./feedbacks.js";
import * as googleCalendarEventExceptions from "./google-calendar-event-exceptions.js";
import * as googleCalendarEvents from "./google-calendar-events.js";
import * as googleCalendars from "./google-calendars.js";
import * as googleCalendarAccounts from "./google-calendar-accounts.js";
import * as invoices from "./invoices.js";
import * as invoiceCustomFields from "./invoice-custom-fields.js";
import * as invoiceLineItems from "./invoice-line-items.js";
import * as invoiceCounters from "./invoice-counters.js";
import * as transactionsReports from "./transactions-reports.js";
import * as viesCheckOlds from "./vies-check-olds.js";
import * as viesChecks from "./vies-checks.js";
import * as featureFlags from "./feature-flags.js";
import * as userFeatureFlags from "./user-feature-flags.js";
import * as communityNotifications from "./community-notifications.js";
import * as umzugMigrations from "./umzug-migrations.js";
import * as discountCodes from "./discount-codes.js";
import * as discountCodeToStoreProducts from "./discount-code-to-store-products.js";
import * as customers from "./customers.js";
import * as storeCustomers from "./store-customers.js";
import * as storePageUrgencies from "./store-page-urgencies.js";
import * as subscriptionV2Products from "./subscription-v-2-products.js";
import * as subscriptionV2Prices from "./subscription-v-2-prices.js";
import * as subscriptionV2Features from "./subscription-v-2-features.js";
import * as subscriptionV2UsageBasedPrices from "./subscription-v-2-usage-based-prices.js";
import * as subscriptionV2UsageBasedTiers from "./subscription-v-2-usage-based-tiers.js";
import * as userSubscriptionProductV2S from "./user-subscription-product-v-2-s.js";
import * as userSubscriptionV2ProductPrices from "./user-subscription-v-2-product-prices.js";
import * as userSubscriptionV2UsageRecords from "./user-subscription-v-2-usage-records.js";
import * as appConfigurationsRelations from "./app-configurations-relations.js";
import * as emailsRelations from "./emails-relations.js";
import * as emailEventsRelations from "./email-events-relations.js";
import * as eventsRelations from "./events-relations.js";
import * as funnelsRelations from "./funnels-relations.js";
import * as funnelStepsRelations from "./funnel-steps-relations.js";
import * as invoiceV2SRelations from "./invoice-v-2-s-relations.js";
import * as invoiceV2LineItemsRelations from "./invoice-v-2-line-items-relations.js";
import * as invoiceNumberSeriesDefinitionsRelations from "./invoice-number-series-definitions-relations.js";
import * as invoiceNumberSeriesAssignmentsRelations from "./invoice-number-series-assignments-relations.js";
import * as invoiceNumberSeriesSequencesRelations from "./invoice-number-series-sequences-relations.js";
import * as usersRelations from "./users-relations.js";
import * as referrerSettingsRelations from "./referrer-settings-relations.js";
import * as referrerIncomesRelations from "./referrer-incomes-relations.js";
import * as notificationPreferencesRelations from "./notification-preferences-relations.js";
import * as userNotificationPreferencesRelations from "./user-notification-preferences-relations.js";
import * as passwordsRelations from "./passwords-relations.js";
import * as sessionsRelations from "./sessions-relations.js";
import * as countriesRelations from "./countries-relations.js";
import * as languagesRelations from "./languages-relations.js";
import * as authenticatorsRelations from "./authenticators-relations.js";
import * as currenciesRelations from "./currencies-relations.js";
import * as currencyLocalizationsRelations from "./currency-localizations-relations.js";
import * as productsRelations from "./products-relations.js";
import * as productLocalizationsRelations from "./product-localizations-relations.js";
import * as productPricingsRelations from "./product-pricings-relations.js";
import * as subscriptionPlansRelations from "./subscription-plans-relations.js";
import * as userInvoicesRelations from "./user-invoices-relations.js";
import * as userInvoiceLineItemsRelations from "./user-invoice-line-items-relations.js";
import * as subscriptionsRelations from "./subscriptions-relations.js";
import * as addressesRelations from "./addresses-relations.js";
import * as storesRelations from "./stores-relations.js";
import * as storeToUsersRelations from "./store-to-users-relations.js";
import * as storePagesRelations from "./store-pages-relations.js";
import * as storeProductsRelations from "./store-products-relations.js";
import * as storeProductUpSellsRelations from "./store-product-up-sells-relations.js";
import * as storeProductPricesRelations from "./store-product-prices-relations.js";
import * as meetingsRelations from "./meetings-relations.js";
import * as meetingBookingsRelations from "./meeting-bookings-relations.js";
import * as meetingAvailabilitySlotsRelations from "./meeting-availability-slots-relations.js";
import * as storeOrdersRelations from "./store-orders-relations.js";
import * as serviceIntegrationsRelations from "./service-integrations-relations.js";
import * as storeThemesRelations from "./store-themes-relations.js";
import * as storeThemeTranslationsRelations from "./store-theme-translations-relations.js";
import * as usersOnServiceIntegrationsRelations from "./users-on-service-integrations-relations.js";
import * as storeSectionsRelations from "./store-sections-relations.js";
import * as userSaleInvoicesRelations from "./user-sale-invoices-relations.js";
import * as userSaleInvoiceCountersRelations from "./user-sale-invoice-counters-relations.js";
import * as invoicingSettingsRelations from "./invoicing-settings-relations.js";
import * as storeProductSubscriptionsRelations from "./store-product-subscriptions-relations.js";
import * as membersRelations from "./members-relations.js";
import * as memberSessionsRelations from "./member-sessions-relations.js";
import * as memberToCommunitiesRelations from "./member-to-communities-relations.js";
import * as communityInvitationsRelations from "./community-invitations-relations.js";
import * as communitiesRelations from "./communities-relations.js";
import * as notificationSettingsRelations from "./notification-settings-relations.js";
import * as communityPostCategoriesRelations from "./community-post-categories-relations.js";
import * as postsRelations from "./posts-relations.js";
import * as postAttachmentsRelations from "./post-attachments-relations.js";
import * as postLikesRelations from "./post-likes-relations.js";
import * as postCommentsRelations from "./post-comments-relations.js";
import * as commentLikesRelations from "./comment-likes-relations.js";
import * as chatsRelations from "./chats-relations.js";
import * as memberToChatsRelations from "./member-to-chats-relations.js";
import * as chatMessagesRelations from "./chat-messages-relations.js";
import * as messageDocumentsRelations from "./message-documents-relations.js";
import * as courseInvitationsRelations from "./course-invitations-relations.js";
import * as coursesRelations from "./courses-relations.js";
import * as courseToCommunitiesRelations from "./course-to-communities-relations.js";
import * as memberToCoursesRelations from "./member-to-courses-relations.js";
import * as courseModulesRelations from "./course-modules-relations.js";
import * as courseSectionsRelations from "./course-sections-relations.js";
import * as memberCourseSectionProgressesRelations from "./member-course-section-progresses-relations.js";
import * as feedbacksRelations from "./feedbacks-relations.js";
import * as googleCalendarEventExceptionsRelations from "./google-calendar-event-exceptions-relations.js";
import * as googleCalendarEventsRelations from "./google-calendar-events-relations.js";
import * as googleCalendarsRelations from "./google-calendars-relations.js";
import * as googleCalendarAccountsRelations from "./google-calendar-accounts-relations.js";
import * as invoicesRelations from "./invoices-relations.js";
import * as invoiceCustomFieldsRelations from "./invoice-custom-fields-relations.js";
import * as invoiceLineItemsRelations from "./invoice-line-items-relations.js";
import * as transactionsReportsRelations from "./transactions-reports-relations.js";
import * as viesCheckOldsRelations from "./vies-check-olds-relations.js";
import * as viesChecksRelations from "./vies-checks-relations.js";
import * as featureFlagsRelations from "./feature-flags-relations.js";
import * as userFeatureFlagsRelations from "./user-feature-flags-relations.js";
import * as communityNotificationsRelations from "./community-notifications-relations.js";
import * as discountCodesRelations from "./discount-codes-relations.js";
import * as discountCodeToStoreProductsRelations from "./discount-code-to-store-products-relations.js";
import * as customersRelations from "./customers-relations.js";
import * as storeCustomersRelations from "./store-customers-relations.js";
import * as storePageUrgenciesRelations from "./store-page-urgencies-relations.js";
import * as subscriptionV2ProductsRelations from "./subscription-v-2-products-relations.js";
import * as subscriptionV2PricesRelations from "./subscription-v-2-prices-relations.js";
import * as subscriptionV2FeaturesRelations from "./subscription-v-2-features-relations.js";
import * as subscriptionV2UsageBasedPricesRelations from "./subscription-v-2-usage-based-prices-relations.js";
import * as subscriptionV2UsageBasedTiersRelations from "./subscription-v-2-usage-based-tiers-relations.js";
import * as userSubscriptionProductV2SRelations from "./user-subscription-product-v-2-s-relations.js";
import * as userSubscriptionV2ProductPricesRelations from "./user-subscription-v-2-product-prices-relations.js";
import * as userSubscriptionV2UsageRecordsRelations from "./user-subscription-v-2-usage-records-relations.js";
import * as countriesToCurrencies from "./countries-to-currencies.js";
import * as countriesToCurrenciesRelations from "./countries-to-currencies-relations.js";

export const schema = {
  ...appConfigurations,
  ...blacklists,
  ...emails,
  ...emailEvents,
  ...suppressionLists,
  ...events,
  ...funnels,
  ...funnelSteps,
  ...invoiceV2S,
  ...invoiceV2LineItems,
  ...invoiceNumberSeriesDefinitions,
  ...invoiceNumberSeriesAssignments,
  ...invoiceNumberSeriesSequences,
  ...users,
  ...referrerSettings,
  ...referrerIncomes,
  ...notificationPreferences,
  ...userNotificationPreferences,
  ...passwords,
  ...sessions,
  ...countries,
  ...languages,
  ...verifications,
  ...authenticators,
  ...currencies,
  ...currencyLocalizations,
  ...products,
  ...productLocalizations,
  ...productPricings,
  ...subscriptionPlans,
  ...userInvoices,
  ...userInvoiceLineItems,
  ...subscriptions,
  ...addresses,
  ...stores,
  ...storeToUsers,
  ...storePages,
  ...storeProducts,
  ...storeProductUpSells,
  ...storeProductPrices,
  ...meetings,
  ...meetingBookings,
  ...meetingAvailabilitySlots,
  ...storeOrders,
  ...serviceIntegrations,
  ...storeThemes,
  ...storeThemeTranslations,
  ...usersOnServiceIntegrations,
  ...storeSections,
  ...userSaleInvoices,
  ...userSaleInvoiceCounters,
  ...invoicingSettings,
  ...storeProductSubscriptions,
  ...members,
  ...memberSessions,
  ...memberToCommunities,
  ...communityInvitations,
  ...communities,
  ...notificationSettings,
  ...communityPostCategories,
  ...posts,
  ...postAttachments,
  ...postLikes,
  ...postComments,
  ...commentLikes,
  ...chats,
  ...memberToChats,
  ...chatMessages,
  ...messageDocuments,
  ...courseInvitations,
  ...courses,
  ...courseToCommunities,
  ...memberToCourses,
  ...courseModules,
  ...courseSections,
  ...memberCourseSectionProgresses,
  ...feedbacks,
  ...googleCalendarEventExceptions,
  ...googleCalendarEvents,
  ...googleCalendars,
  ...googleCalendarAccounts,
  ...invoices,
  ...invoiceCustomFields,
  ...invoiceLineItems,
  ...invoiceCounters,
  ...transactionsReports,
  ...viesCheckOlds,
  ...viesChecks,
  ...featureFlags,
  ...userFeatureFlags,
  ...communityNotifications,
  ...umzugMigrations,
  ...discountCodes,
  ...discountCodeToStoreProducts,
  ...customers,
  ...storeCustomers,
  ...storePageUrgencies,
  ...subscriptionV2Products,
  ...subscriptionV2Prices,
  ...subscriptionV2Features,
  ...subscriptionV2UsageBasedPrices,
  ...subscriptionV2UsageBasedTiers,
  ...userSubscriptionProductV2S,
  ...userSubscriptionV2ProductPrices,
  ...userSubscriptionV2UsageRecords,
  ...appConfigurationsRelations,
  ...emailsRelations,
  ...emailEventsRelations,
  ...eventsRelations,
  ...funnelsRelations,
  ...funnelStepsRelations,
  ...invoiceV2SRelations,
  ...invoiceV2LineItemsRelations,
  ...invoiceNumberSeriesDefinitionsRelations,
  ...invoiceNumberSeriesAssignmentsRelations,
  ...invoiceNumberSeriesSequencesRelations,
  ...usersRelations,
  ...referrerSettingsRelations,
  ...referrerIncomesRelations,
  ...notificationPreferencesRelations,
  ...userNotificationPreferencesRelations,
  ...passwordsRelations,
  ...sessionsRelations,
  ...countriesRelations,
  ...languagesRelations,
  ...authenticatorsRelations,
  ...currenciesRelations,
  ...currencyLocalizationsRelations,
  ...productsRelations,
  ...productLocalizationsRelations,
  ...productPricingsRelations,
  ...subscriptionPlansRelations,
  ...userInvoicesRelations,
  ...userInvoiceLineItemsRelations,
  ...subscriptionsRelations,
  ...addressesRelations,
  ...storesRelations,
  ...storeToUsersRelations,
  ...storePagesRelations,
  ...storeProductsRelations,
  ...storeProductUpSellsRelations,
  ...storeProductPricesRelations,
  ...meetingsRelations,
  ...meetingBookingsRelations,
  ...meetingAvailabilitySlotsRelations,
  ...storeOrdersRelations,
  ...serviceIntegrationsRelations,
  ...storeThemesRelations,
  ...storeThemeTranslationsRelations,
  ...usersOnServiceIntegrationsRelations,
  ...storeSectionsRelations,
  ...userSaleInvoicesRelations,
  ...userSaleInvoiceCountersRelations,
  ...invoicingSettingsRelations,
  ...storeProductSubscriptionsRelations,
  ...membersRelations,
  ...memberSessionsRelations,
  ...memberToCommunitiesRelations,
  ...communityInvitationsRelations,
  ...communitiesRelations,
  ...notificationSettingsRelations,
  ...communityPostCategoriesRelations,
  ...postsRelations,
  ...postAttachmentsRelations,
  ...postLikesRelations,
  ...postCommentsRelations,
  ...commentLikesRelations,
  ...chatsRelations,
  ...memberToChatsRelations,
  ...chatMessagesRelations,
  ...messageDocumentsRelations,
  ...courseInvitationsRelations,
  ...coursesRelations,
  ...courseToCommunitiesRelations,
  ...memberToCoursesRelations,
  ...courseModulesRelations,
  ...courseSectionsRelations,
  ...memberCourseSectionProgressesRelations,
  ...feedbacksRelations,
  ...googleCalendarEventExceptionsRelations,
  ...googleCalendarEventsRelations,
  ...googleCalendarsRelations,
  ...googleCalendarAccountsRelations,
  ...invoicesRelations,
  ...invoiceCustomFieldsRelations,
  ...invoiceLineItemsRelations,
  ...transactionsReportsRelations,
  ...viesCheckOldsRelations,
  ...viesChecksRelations,
  ...featureFlagsRelations,
  ...userFeatureFlagsRelations,
  ...communityNotificationsRelations,
  ...discountCodesRelations,
  ...discountCodeToStoreProductsRelations,
  ...customersRelations,
  ...storeCustomersRelations,
  ...storePageUrgenciesRelations,
  ...subscriptionV2ProductsRelations,
  ...subscriptionV2PricesRelations,
  ...subscriptionV2FeaturesRelations,
  ...subscriptionV2UsageBasedPricesRelations,
  ...subscriptionV2UsageBasedTiersRelations,
  ...userSubscriptionProductV2SRelations,
  ...userSubscriptionV2ProductPricesRelations,
  ...userSubscriptionV2UsageRecordsRelations,
  ...countriesToCurrencies,
  ...countriesToCurrenciesRelations,
};
