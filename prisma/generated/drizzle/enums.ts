import { pgEnum } from 'drizzle-orm/pg-core';

export const enum_for_defaultEnum = pgEnum('enum_for_default', ['TypeOne', 'TypeTwo']);

export const enumEnum = pgEnum('enum', ['A', 'B']);