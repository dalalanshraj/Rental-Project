import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./index.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// FRONTEND
import HeroSection from "./pages/Home";
import Properties from "./pages/Properties";
import Results from "./pages/Results";
import PropertyDetail from "./pages/PropertyDetails";
import BookingPage from "./pages/BookingPage";
import SeaDunesBeachFront from "./pages/PropertiesListing/SeaDunes";


// ADMIN
import AdminRoute from "./admin/AdminRoute";
import AdminLayout from "./admin/AdminLayout";
import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import Listings from "./admin/pages/Listings";
import AddListing from "./admin/pages/AddListing";
import Bookings from "./admin/pages/Bookings";
import Users from "./admin/pages/Users";
import SpecialsDeals from "./pages/Specials";

function App() {
  const location = useLocation();

  // 🔑 check: are we on admin page?
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* FRONTEND ONLY */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* FRONTEND ROUTES */}
        <Route path="/" element={<HeroSection />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/results" element={<Results />} />
        <Route path="/BookingPage" element={<BookingPage />} />
        <Route path="/:id" element={<PropertyDetail />} />
        <Route path="/specials" element={<SpecialsDeals/>} />
        <Route path="/sea-dunes-beach-front" element={<SeaDunesBeachFront />} />
        
          

        {/* ADMIN LOGIN */}
        <Route path="/admin/login" element={<Login />} />

        {/* ADMIN PAGES */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/listings"
          element={
            <AdminRoute>
              <AdminLayout>
                <Listings />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/listings/property_add"
          element={
            <AdminRoute>
              <AdminLayout>
                <AddListing />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <AdminRoute>
              <AdminLayout>
                <Bookings />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminLayout>
                <Users />
              </AdminLayout>
            </AdminRoute>
          }

        />
        <Route
          path="/admin/listings/:id"
          element={
            <AdminRoute>
              <AdminLayout>
                <AddListing />
              </AdminLayout>
            </AdminRoute>
          }
        />
      </Routes>

      {/* FRONTEND ONLY */}
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
