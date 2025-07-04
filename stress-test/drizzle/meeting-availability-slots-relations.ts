import { relations } from "drizzle-orm";
import { meetingAvailabilitySlots } from "./meeting-availability-slots.js";
import { meetings } from "./meetings.js";

export const meetingAvailabilitySlotsRelations = relations(
  meetingAvailabilitySlots,
  (helpers) => ({
    meeting: helpers.one(meetings, {
      relationName: "MeetingToMeetingAvailabilitySlot",
      fields: [meetingAvailabilitySlots.meetingId],
      references: [meetings.id],
    }),
  }),
);
