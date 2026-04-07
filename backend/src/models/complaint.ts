import { mysqlTable, varchar, text, mysqlEnum, timestamp } from "drizzle-orm/mysql-core";
import { response } from "express";

export const complaints = mysqlTable("complaints", {
    id: varchar("id", { length: 36 }).primaryKey(),

    userId: varchar("user_id", { length: 36 }).notNull(),

    title: varchar("title", { length: 255 }).notNull(),

    description: text("description").notNull(),

    status: mysqlEnum("status", ["pending", "working", "failed", "resolved"])
        .notNull()
        .default("pending"),

    response: text("response"),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type Complaint = typeof complaints.$inferSelect;