import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const chatMessages = pgTable("ChatMessage", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  chatId: text("chatId").notNull(),
  memberId: text("memberId"),
  userId: text("userId").notNull(),
  content: text("content").notNull(),
  notificationSentAt: timestamp("notificationSentAt", {
    mode: "date",
    precision: 3,
  }),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
});
