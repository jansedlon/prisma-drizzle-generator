import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const googleCalendars = pgTable("GoogleCalendar", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  googleCalendarId: text("googleCalendarId").notNull(),
  summary: text("summary").notNull(),
  description: text("description"),
  timezone: text("timezone").notNull(),
  channelId: text("channelId"),
  resourceId: text("resourceId"),
  expiration: timestamp("expiration", { mode: "date", precision: 3 }),
  accessRole: text("accessRole").notNull(),
  selected: boolean("selected").default(false).notNull(),
  primary: boolean("primary").default(false).notNull(),
  selectedForEventCreation: boolean("selectedForEventCreation")
    .default(false)
    .notNull(),
  selectedForConflictCheck: boolean("selectedForConflictCheck")
    .default(false)
    .notNull(),
  userId: text("userId").notNull(),
  accountId: text("accountId").notNull(),
  nextSyncToken: text("nextSyncToken"),
  lastSyncedAt: timestamp("lastSyncedAt", { mode: "date", precision: 3 }),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
