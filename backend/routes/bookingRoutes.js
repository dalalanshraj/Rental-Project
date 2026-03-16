import express from "express";
import {
  createPaymentIntent ,
  previewBooking,
  createBooking,
  getAllBookings,
  updateBookingStatus,
  getDashboardStats ,
  deleteBooking,
  
} from "../controllers/bookingController.js";

import { isAuth, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ---------------- PUBLIC / USER ----------------
router.post("/create-payment-intent", createPaymentIntent);
router.post("/preview", previewBooking);
router.post("/create", createBooking);
router.get("/admin/dashboard", getDashboardStats);
router.delete("/:id", deleteBooking);


// ---------------- ADMIN ----------------
router.get("/", isAuth, isAdmin, getAllBookings);

router.put(
  "/:id/status",
  isAuth,
  isAdmin,
  updateBookingStatus
);

export default router;
