import { pgEnum } from "drizzle-orm/pg-core";

export const notificationChannelEnum = pgEnum("NotificationChannel", ["EMAIL"]);
