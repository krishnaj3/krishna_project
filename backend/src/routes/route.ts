import { Router } from "express";
import { login, logout, register } from "../controllers/auth";
import { deleteUser, editUser, getMe, getUsers } from "../controllers/user";
import { allowedRole, requireAuth } from "../middleware/auth";
import { createComplaint, deleteComplaint, editComplaint, getComplaints } from "../controllers/complaint";

export const router = Router()

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/logout", logout);

router.use(requireAuth);

router.get("/user/me", getMe);
router.get("/user", allowedRole(['admin']), getUsers);
router.delete("/user/:userId", allowedRole(['admin']), deleteUser);
router.patch("/user/:userId", editUser);

router.get("/complaint", getComplaints);
router.post("/complaint", allowedRole(['user']), createComplaint);
router.patch("/complaint/:complaintId", editComplaint);
router.delete("/complaint/:complaintId", allowedRole(['user']), deleteComplaint);
