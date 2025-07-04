import { text, pgTable, primaryKey } from 'drizzle-orm/pg-core';

export const eventAttendee = pgTable('event_attendees', {
  eventId: text('eventId').notNull(),
  userId: text('userId').notNull(),
  status: text('status').notNull().default('going'),
  primaryKey({ columns: ['eventId', 'userId'] })
});