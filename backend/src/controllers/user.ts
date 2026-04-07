import { Request, Response } from "express"
import { db } from "../config/db";
import { User, users } from "../models/user";
import { eq } from "drizzle-orm";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user as User

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized access" })
        }

        const allUsers = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            status: users.status,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt
        }).from(users).where(eq(users.role, "user"));

        return res.status(200).json({ users: allUsers })
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}

export const getMe = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user as User

        const allUsers = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            status: users.status,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt
        }).from(users).where(eq(users.id, user.id));

        return res.status(200).json({ user: allUsers[0] })
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        let userId = req.params.userId

        const user = (req as any).user as User

        if (user.role === "user") {
            return res.status(400).json({ message: "User is not authorized to delete user" })
        }

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" })
        }

        await db.delete(users).where(eq(users.id, userId as string))

        return res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}

export const editUser = async (req: Request, res: Response) => {
    try {
        let userId = req.params.userId

        const user = (req as any).user as User

        const { name, status } = req.body

        if (user.role === "user") {
            if (status) {
                return res.status(400).json({ message: "User can't update status" })
            }
            userId = user.id
        }

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" })
        }

        await db.update(users).set({ name, status }).where(eq(users.id, userId as string))

        return res.status(200).json({ message: "User updated successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}