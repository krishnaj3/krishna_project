
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { v7 as uuidv7 } from "uuid";
import { db } from "../config/db";
import { users } from "../models/user";
import { sessions } from "../models/session";
import { eq } from "drizzle-orm";

const SALT_ROUNDS = 10;

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{6,20}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be between 6 and 20 characters long, include one uppercase letter and one symbol"
            });
        }

        if (name.length < 3 || name.length > 30) {
            return res.status(400).json({ message: "Name must be between 3 and 30 characters long" });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,30}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }



        const existing = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

        if (existing.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        await db.insert(users).values({
            id: uuidv7(),
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({ message: "User created" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password: passwordField } = req.body;

        const result = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

        if (result.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(passwordField, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (user.status === "inactive") {
            return res.status(400).json({ message: "Your account is inactive. Please contact the administrator." });
        }

        // We create session for the user and store it in database
        const sessionId = uuidv7();
        await db.insert(sessions).values({
            id: sessionId,
            userId: user.id,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        res.cookie("sessionId", sessionId, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        });

        const { password, ...userWithoutPassword } = user;

        return res.json({ message: "Login successful", user: userWithoutPassword });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const sessionId = req.cookies.sessionId;

        if (sessionId) {
            await db.delete(sessions).where(eq(sessions.id, sessionId));
        }

        res.clearCookie("sessionId", {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        });

        return res.json({ message: "Logged out" });
    } catch {
        return res.status(500).json({ message: "Server error" });
    }
};