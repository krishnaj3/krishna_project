import { Request, Response } from "express";
import { db } from "../config/db";
import { v7 as uuidv7 } from "uuid";
import { complaints } from "../models/complaint";
import { desc, eq } from "drizzle-orm";
import { User } from "../models/user";


export const createComplaint = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user as User

        if (user.role !== "user") {
            return res.status(400).json({ message: "User is not authorized to create complaint" })
        }

        const { title, description } = req.body

        if (!title) {
            return res.status(400).json({ message: "Title is required" })
        }

        if (!description) {
            return res.status(400).json({ message: "Description is required" })
        }

        await db.insert(complaints).values({
            id: uuidv7(),
            title,
            description,
            userId: (req as any).user.id,
        })

        return res.status(201).json({ message: "Complaint created successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Server error" })
    }
}

export const editComplaint = async (req: Request, res: Response) => {
    try {
        const { complaintId } = req.params

        if (!complaintId) {
            return res.status(400).json({ message: "Complaint ID is required" })
        }

        const user = (req as any).user as User

        const { title, description, status, response } = req.body


        if (user.role === 'user') {

            if (!title) {
                return res.status(400).json({ message: "Title is required" })
            }

            if (!description) {
                return res.status(400).json({ message: "Description is required" })
            }

            const complaint = await db.select({
                userId: complaints.userId
            }).from(complaints).where(eq(complaints.id, complaintId as string))

            if (complaint.length === 0) {
                return res.status(400).json({ message: "Complaint not found" })
            }

            if (complaint[0].userId !== user.id) {
                return res.status(400).json({ message: "User is not authorized to edit complaint" })
            }

            await db.update(complaints).set({
                title,
                description,
            }).where(eq(complaints.id, complaintId as string))

            return res.status(200).json({ message: "Complaint updated successfully" })

        } else {

            if (!status) {
                return res.status(400).json({ message: "Status is required" })
            }

            await db.update(complaints).set({
                status,
                response: response || null,
            }).where(eq(complaints.id, complaintId as string))

            return res.status(200).json({ message: "Complaint updated successfully" })

        }

    } catch (error) {
        return res.status(500).json({ message: "Server error" })
    }
}

export const deleteComplaint = async (req: Request, res: Response) => {
    try {
        const { complaintId } = req.params


        if (!complaintId) {
            return res.status(400).json({ message: "Complaint ID is required" })
        }

        const user = (req as any).user as User

        if (user.role !== "user") {
            return res.status(400).json({ message: "User is not authorized to delete complaint" })
        }

        const complaint = await db.select({
            userId: complaints.userId
        }).from(complaints).where(eq(complaints.id, complaintId as string))

        if (complaint.length === 0) {
            return res.status(400).json({ message: "Complaint not found" })
        }

        if (complaint[0].userId !== user.id) {
            return res.status(400).json({ message: "User is not authorized to delete complaint" })
        }

        await db.delete(complaints).where(eq(complaints.id, complaintId as string))

        return res.status(200).json({ message: "Complaint deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Server error" })
    }
}

export const getComplaints = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user as User

        const query = db.select().from(complaints)

        if (user.role === 'user') {
            query.where(eq(complaints.userId, user.id))
        }

        const data = await query.orderBy(desc(complaints.createdAt))

        return res.status(200).json({ complaints: data })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Server error" })
    }
}