import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import type { ChatDocumentMetadata } from "@flixydev/flixy-types/prisma";

export const messageDocuments = pgTable("MessageDocument", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  messageId: text("messageId").notNull(),
  metadata: jsonb("metadata").$type<ChatDocumentMetadata>().notNull(),
  location: text("location"),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
});
