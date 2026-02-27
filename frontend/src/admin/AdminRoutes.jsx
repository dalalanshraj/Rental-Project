import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Listings from "./pages/Listings";
import AddListing from "./pages/AddListing";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/booking-form" element={<AdminRoute><BookingForm /></AdminRoute>} />
      <Route path="/admin/booking-success" element={<AdminRoute><BookingSuccess /></AdminRoute>} />
    </Routes>
  );
}
