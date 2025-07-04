import { pgEnum } from "drizzle-orm/pg-core";

export const meetingBookingStatusEnum = pgEnum("MeetingBookingStatus", [
  "BOOKED",
  "CANCELLED",
]);
