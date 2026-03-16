import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Listing from "../models/Listing.js";
import Booking from "../models/Booking.js";
import Coupon from "../models/Coupon.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ================================
// HELPERS
// ================================
const toValidDate = (value) => {
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};

const normalizeNoonDate = (value) => {
  if (!value) return null;

  // if already Date object
  if (value instanceof Date) {
    const d = new Date(value);
    if (isNaN(d.getTime())) return null;
    d.setHours(12, 0, 0, 0);
    return d;
  }

  // if yyyy-mm-dd string
  if (typeof value === "string") {
    const d = new Date(`${value}T12:00:00`);
    return isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  d.setHours(12, 0, 0, 0);
  return d;
};

const dateOnly = (value) => {
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
};

const normalizeCalendar = (calendar = []) => {
  if (!Array.isArray(calendar)) return [];

  return calendar
    .map((item) => {
      const d = toValidDate(item?.date);
      if (!d) return null;

      return {
        date: d,
        status: ["A", "R", "H"].includes(item?.status) ? item.status : "A",
        source: ["internal", "booking", "admin", "ical"].includes(item?.source)
          ? item.source
          : "internal",
        price: item?.price,
      };
    })
    .filter(Boolean);
};

// ----------------------------------------------------------
// PREVIEW BOOKING
// ----------------------------------------------------------
export const previewBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut } = req.body;

    const property = await Listing.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const start = normalizeNoonDate(checkIn);
    const end = normalizeNoonDate(checkOut);

    if (!start || !end) {
      return res.status(400).json({ error: "Invalid check-in or check-out date" });
    }

    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (nights <= 0) {
      return res.status(400).json({ error: "Invalid date range" });
    }

    let subtotal = 0;
    let nightlyBreakdown = [];

    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);

      const calendarDay = property.calendar?.find(
        (d) => dateOnly(d.date) === dateOnly(currentDate)
      );

      if (calendarDay?.price) {
        subtotal += calendarDay.price;
        nightlyBreakdown.push({
          date: currentDate,
          price: calendarDay.price,
          source: "calendar",
        });
        continue;
      }

      const rate = property.rates.find((r) => {
        const rateStart = toValidDate(r.from);
        const rateEnd = toValidDate(r.to);
        if (!rateStart || !rateEnd) return false;

        return currentDate >= rateStart && currentDate <= rateEnd;
      });

      if (rate?.nightly) {
        subtotal += rate.nightly;
        nightlyBreakdown.push({
          date: currentDate,
          price: rate.nightly,
          source: "season",
        });
        continue;
      }

      const fallback = property.basePrice || 150;
      subtotal += fallback;
      nightlyBreakdown.push({
        date: currentDate,
        price: fallback,
        source: "fallback",
      });
    }

    const cleaningFee = 150;
    const serviceFee = Math.round(subtotal * 0.05);
    const taxes = Math.round(subtotal * 0.12);
    const warranty = 79;

    const total = subtotal + cleaningFee + serviceFee + taxes + warranty;

    res.json({
      nights,
      subtotal,
      cleaningFee,
      serviceFee,
      taxes,
      warranty,
      total,
      nightlyBreakdown,
    });
  } catch (error) {
    console.error("Preview Booking Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ----------------------------------------------------------
// CREATE BOOKING (Stripe Verification)
// ----------------------------------------------------------
export const createBooking = async (req, res) => {
  console.log("CREATE BOOKING BODY:", req.body);
  try {
    const {
      propertyId,
      checkIn,
      checkOut,
      guests,
      user,
      pricing,
      paymentIntentId,
    } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: "Payment not completed" });
    }

    const listing = await Listing.findById(propertyId);
    if (!listing) {
      return res.status(404).json({ error: "Property not found" });
    }

    const start = normalizeNoonDate(checkIn);
    const end = normalizeNoonDate(checkOut);

    if (!start || !end || start >= end) {
      return res.status(400).json({ error: "Invalid booking dates" });
    }

    const booking = new Booking({
      property: propertyId,
      checkIn: start,
      checkOut: end,
      guests,
      nights: pricing?.nights,
      user,
      pricing,
      payment: {
        provider: "stripe",
        paid: true,
        paymentIntentId,
      },
      status: "confirmed",
    });

    await booking.save();

    listing.calendar = normalizeCalendar(listing.calendar);

    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const current = new Date(d);
      const exists = listing.calendar.find(
        (c) => dateOnly(c.date) === dateOnly(current)
      );

      if (!exists) {
        listing.calendar.push({
          date: current,
          status: "R",
          source: "booking",
        });
      }
    }

    listing.calendar = normalizeCalendar(listing.calendar);
    console.log(
  "CALENDAR BEFORE SAVE:",
  listing.calendar.map((c) => ({
    date: c.date,
    status: c.status,
    source: c.source,
  }))
);
    await listing.save();

    res.json({
      message: "Booking confirmed & calendar updated",
      bookingId: booking._id,
    });
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ error: "Booking failed" });
  }
};

// ----------------------------------------------------------
// UPDATE BOOKING STATUS
// ----------------------------------------------------------
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ error: "Booking already cancelled" });
    }

    if (status === "confirmed") {
      const property = await Listing.findById(booking.property);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }

      // FIX: booking.checkIn / booking.checkOut are already Date values
      const start = normalizeNoonDate(booking.checkIn);
      const end = normalizeNoonDate(booking.checkOut);

      if (!start || !end || start >= end) {
        return res.status(400).json({ error: "Invalid booking dates in record" });
      }

      property.calendar = normalizeCalendar(property.calendar);

      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        const current = new Date(d);
        const exists = property.calendar.find(
          (c) => dateOnly(c.date) === dateOnly(current)
        );

        if (!exists) {
          property.calendar.push({
            date: current,
            status: "R",
            source: "booking",
          });
        }
      }

      // turnover / hold day
      const turnoverExists = property.calendar.find(
        (c) => dateOnly(c.date) === dateOnly(end)
      );

      if (!turnoverExists) {
        property.calendar.push({
          date: new Date(end),
          status: "H",
          source: "booking",
        });
      }

      property.calendar = normalizeCalendar(property.calendar);
      await property.save();

      booking.status = "confirmed";
    }

    if (status === "cancelled") {
      booking.status = "cancelled";
    }

    await booking.save();

    res.json({
      message: `Booking ${status}`,
      booking,
    });
  } catch (err) {
    console.error("Update booking status error:", err);
    res.status(500).json({ error: "Failed to update booking status" });
  }
};

// ----------------------------------------------------------
// GET ALL BOOKINGS (ADMIN)
// ----------------------------------------------------------
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("property")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    const intent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    res.status(500).json({ error: "Payment failed" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await mongoose.model("User").countDocuments();
    const totalListing = await Listing.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: "pending" });

    const monthlyBookings = await Booking.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const formatted = monthlyBookings.map((item) => ({
      month: months[item._id - 1],
      bookings: item.bookings,
    }));

    res.json({
      totalUsers,
      totalListing,
      totalBookings,
      pendingBookings,
      monthlyBookings: formatted,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Dashboard error" });
  }
};

// ----------------------------------------------------------
// DELETE BOOKING
// ----------------------------------------------------------
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const listing = await Listing.findById(booking.property);
    if (!listing) {
      return res.status(404).json({ error: "Property not found" });
    }

    const toDateKey = (value) => {
      const d = new Date(value);
      if (isNaN(d.getTime())) return null;
      return d.toISOString().slice(0, 10);
    };

    const start = new Date(booking.checkIn);
    const end = new Date(booking.checkOut);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid booking dates in record" });
    }

    // booking ki reserved stay dates nikaalo
    const stayDateKeys = new Set();
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const key = toDateKey(d);
      if (key) stayDateKeys.add(key);
    }

    // checkout / turnover day
    const turnoverKey = toDateKey(end);

    console.log("DELETE BOOKING ID:", booking._id);
    console.log("STAY DATE KEYS:", [...stayDateKeys]);
    console.log("TURNOVER KEY:", turnoverKey);
    console.log("CALENDAR BEFORE DELETE:", listing.calendar);

    listing.calendar = (listing.calendar || []).filter((item) => {
      const key = toDateKey(item.date);
      if (!key) return false;

      // remove all booking-created reserved dates
      if (item.source === "booking" && item.status === "R" && stayDateKeys.has(key)) {
        return false;
      }

      // remove booking-created turnover day
      if (item.source === "booking" && item.status === "H" && key === turnoverKey) {
        return false;
      }

      return true;
    });

    console.log("CALENDAR AFTER DELETE:", listing.calendar);

    await listing.save();
    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: "Booking deleted and calendar updated" });
  } catch (err) {
    console.error("Delete booking error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
};

