import { pgEnum } from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', ['ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED']);

export const priorityEnum = pgEnum('priority', ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

export const userRoleEnum = pgEnum('user_role', ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'USER', 'GUEST']);