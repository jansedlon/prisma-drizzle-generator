import { relations } from 'drizzle-orm';
import { notification } from './notification-schema.js';
import { user } from './user-schema.js';

export const notificationRelations = relations(notification, ({ one, many }) => ({
  notificationToUsers: many(notification),
  notificationToUser: one(user, {
    fields: [notification.userId],
    references: [user.id],
    onDelete: 'cascade',
    
  })
}));