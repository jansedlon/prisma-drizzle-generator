import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const googleCalendarEventExceptions = pgTable(
  "GoogleCalendarEventException",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),
    opaqueId: text("opaqueId").notNull(),
    recurringEventId: text("recurringEventId").notNull(),
    status: text("status").notNull(),
    googleCalendarEventId: text("googleCalendarEventId").notNull(),
    iCalUID: text("iCalUID"),
    start: timestamp("start", { mode: "date", precision: 3 }),
    startTimezone: text("startTimezone"),
    end: timestamp("end", { mode: "date", precision: 3 }),
    endTimezone: text("endTimezone"),
    originalStartTime: timestamp("originalStartTime", {
      mode: "date",
      precision: 3,
    }),
    originalTimezone: text("originalTimezone"),
    title: text("title"),
    description: text("description"),
    visibility: text("visibility"),
    eventType: text("eventType"),
    location: text("location"),
    created: timestamp("created", { mode: "date", precision: 3 }),
    updated: timestamp("updated", { mode: "date", precision: 3 }),
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
);
