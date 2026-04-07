import { Request, Response, NextFunction } from "express";
import { db } from "../config/db";
import { sessions } from "../models/session";
import { eq } from "drizzle-orm";
import { ROLES, User, UserRole, users } from "../models/user";

export const requireAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sessionId = req.cookies.sessionId;

        if (!sessionId) {
            console.log("No session ID");
            return res.status(401).json({ message: "Unauthorized" });
        }

        const result = await db
            .select()
            .from(sessions)
            .innerJoin(users, eq(sessions.userId, users.id))
            .where(eq(sessions.id, sessionId));

        if (result.length === 0) {
            return res.status(401).json({ message: "Invalid session" });
        }

        const { sessions: session, users: user } = result[0];

        if (new Date(session.expiresAt) < new Date()) {
            return res.status(401).json({ message: "Session expired" });
        }

        if (user.status === "inactive") {
            return res.status(401).json({ message: "User is inactive" });
        }

        const { password, ...userWithoutPassword } = user;

        (req as any).user = userWithoutPassword as typeof user;
        (req as any).session = session as typeof session;

        next();
    } catch {
        return res.status(500).json({ message: "Server error" });
    }
};

export const allowedRole = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user as User
        if (!roles.includes(user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    }
}