import { mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core";

export const sessions = mysqlTable("sessions", {
    id: varchar("id", { length: 36 }).primaryKey(), // UUID v7

    userId: varchar("user_id", { length: 36 }).notNull(),

    createdAt: timestamp("created_at").defaultNow(),

    expiresAt: timestamp("expires_at").notNull(),
});

export type Session = typeof sessions.$inferSelect;