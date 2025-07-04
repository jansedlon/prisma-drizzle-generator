import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const memberToChats = pgTable("MemberToChat", {
  memberId: text("memberId"),
  userId: text("userId").notNull(),
  chatId: text("chatId").notNull(),
  unreadMessagesCount: integer("unreadMessagesCount").default(0).notNull(),
  lastSeenAt: timestamp("lastSeenAt", { mode: "date", precision: 3 }),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
});
