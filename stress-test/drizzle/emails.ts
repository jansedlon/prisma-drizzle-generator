import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { emailStatusEnum } from "./email-status-enum.js";

export const emails = pgTable("Email", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  subject: text("subject").notNull(),
  from: text("from").notNull(),
  to: text("to").notNull(),
  bodyPreview: text("bodyPreview"),
  providerId: text("providerId"),
  provider: text("provider").notNull(),
  status: emailStatusEnum("status").notNull(),
  sentAt: timestamp("sentAt", { mode: "date", precision: 3 }),
  deliveredAt: timestamp("deliveredAt", { mode: "date", precision: 3 }),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .$onUpdateFn(() => new Date())
    .notNull(),
});
