import express from "express";
import {
  adminLogin,
  getAllUsers,
  dashboardStats,
  createAdmin,
} from "../controllers/adminController.js";

import { isAuth, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔓 Public
router.post("/login", adminLogin);

// 🔐 Protected ADMIN routes
router.get("/dashboard", isAuth, isAdmin, dashboardStats);
router.get("/users", isAuth, isAdmin, getAllUsers);
router.post("/register", createAdmin); // TEMPORARY




export default router;
