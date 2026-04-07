import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
});

export const connectDB = async () => {
    try {
        const conn = await pool.getConnection();
        console.log("Database connected");
        conn.release();
    } catch (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
};

export const db = drizzle(pool, {
    logger: true,
});