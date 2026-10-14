import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const accessCodes = sqliteTable('access_codes', {
 id: text('id').primaryKey(), label: text('label').notNull(),
 hash: text('hash').notNull().unique(), expires: integer('expires').notNull(),
 revoked: integer('revoked').notNull().default(0), created: integer('created').notNull()
});
