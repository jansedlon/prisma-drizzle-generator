import { pgTable, text, bigint, boolean } from "drizzle-orm/pg-core";

export const authenticators = pgTable("Authenticator", {
  credentialID: text("credentialID").primaryKey(),
  userId: text("userId").notNull(),
  credentialPublicKey: text("credentialPublicKey").notNull(),
  counter: bigint("counter", { mode: "bigint" }).notNull(),
  credentialDeviceType: text("credentialDeviceType").notNull(),
  credentialBackedUp: boolean("credentialBackedUp").notNull(),
  transports: text("transports").notNull(),
});
