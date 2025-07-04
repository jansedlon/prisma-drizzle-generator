import { relations } from "drizzle-orm";
import { meetings } from "./meetings.js";
import { meetingAvailabilitySlots } from "./meeting-availability-slots.js";
import { storeProducts } from "./store-products.js";
import { meetingBookings } from "./meeting-bookings.js";

export const meetingsRelations = relations(meetings, (helpers) => ({
  availabilitySlots: helpers.many(meetingAvailabilitySlots, {
    relationName: "MeetingToMeetingAvailabilitySlot",
  }),
  product: helpers.one(storeProducts, {
    relationName: "MeetingToStoreProduct",
    fields: [meetings.productId],
    references: [storeProducts.id],
  }),
  bookings: helpers.many(meetingBookings, {
    relationName: "MeetingToMeetingBooking",
  }),
}));
