import { mysqlTable, varchar, mysqlEnum, timestamp } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
    id: varchar("id", { length: 36 }).primaryKey(), // UUID v7

    name: varchar("name", { length: 255 }).notNull(),

    email: varchar("email", { length: 255 })
        .notNull()
        .unique(),

    password: varchar("password", { length: 255 }).notNull(),

    role: mysqlEnum("role", ["user", "admin"])
        .notNull()
        .default("user"),

    status: mysqlEnum("status", ["active", "inactive"])
        .notNull()
        .default("active"),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const ROLES = users.role.enumValues;

export type UserRole = typeof users.role.enumValues[number]
export type User = typeof users.$inferSelect;