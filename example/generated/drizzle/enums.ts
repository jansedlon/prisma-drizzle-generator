import { pgEnum } from 'drizzle-orm/pg-core';

export const user_roleEnum = pgEnum('user_role', ['ADMIN', 'USER', 'MODERATOR']);