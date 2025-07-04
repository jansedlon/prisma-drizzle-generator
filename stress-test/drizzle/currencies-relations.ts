import { relations } from "drizzle-orm";
import { currencies } from "./currencies.js";
import { currencyLocalizations } from "./currency-localizations.js";
import { productPricings } from "./product-pricings.js";
import { userInvoices } from "./user-invoices.js";
import { users } from "./users.js";
import { countriesToCurrencies } from "./countries-to-currencies.js";
import { referrerIncomes } from "./referrer-incomes.js";
import { storeProductPrices } from "./store-product-prices.js";
import { storeOrders } from "./store-orders.js";
import { userSaleInvoices } from "./user-sale-invoices.js";
import { invoices } from "./invoices.js";
import { subscriptionV2Prices } from "./subscription-v-2-prices.js";
import { subscriptionV2UsageBasedPrices } from "./subscription-v-2-usage-based-prices.js";
import { discountCodes } from "./discount-codes.js";
import { invoiceV2S } from "./invoice-v-2-s.js";

export const currenciesRelations = relations(currencies, (helpers) => ({
  translations: helpers.many(currencyLocalizations, {
    relationName: "CurrencyToCurrencyLocalization",
  }),
  productPricings: helpers.many(productPricings, {
    relationName: "CurrencyToProductPricing",
  }),
  userInvoices: helpers.many(userInvoices, {
    relationName: "CurrencyToUserInvoice",
  }),
  users: helpers.many(users, { relationName: "CurrencyToUser" }),
  countries: helpers.many(countriesToCurrencies),
  refererrIncomesSourceCurrency: helpers.many(referrerIncomes, {
    relationName: "ReferrerIncomesSourceCurrency",
  }),
  refererrIncomesDestinationCurrency: helpers.many(referrerIncomes, {
    relationName: "ReferrerIncomesDestinationCurrency",
  }),
  storeProductsPrice: helpers.many(storeProductPrices, {
    relationName: "CurrencyToStoreProductPrice",
  }),
  storeOrders: helpers.many(storeOrders, {
    relationName: "CurrencyToStoreOrder",
  }),
  saleInvoices: helpers.many(userSaleInvoices, {
    relationName: "CurrencyToUserSaleInvoice",
  }),
  invoices: helpers.many(invoices, { relationName: "CurrencyToInvoice" }),
  subscriptionPrices: helpers.many(subscriptionV2Prices, {
    relationName: "CurrencyToSubscriptionV2Price",
  }),
  subscriptionUsageBasedPrices: helpers.many(subscriptionV2UsageBasedPrices, {
    relationName: "CurrencyToSubscriptionV2UsageBasedPrice",
  }),
  DiscountCode: helpers.many(discountCodes, {
    relationName: "CurrencyToDiscountCode",
  }),
  invoicesV2: helpers.many(invoiceV2S, { relationName: "CurrencyToInvoiceV2" }),
}));
