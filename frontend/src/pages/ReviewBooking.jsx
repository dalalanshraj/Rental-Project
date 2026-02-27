import { useState } from "react";
import { confirmBooking } from "../api/bookingApi";

const ReviewBooking = ({ property, checkIn, checkOut, pricing }) => {
  const [user, setUser] = useState({});

  const handleSubmit = async () => {
    const res = await confirmBooking({
      property: property._id,
      user,
      checkIn,
      checkOut,
      nights: pricing.nights,
      pricing,
      paymentStatus: "pending",
    });

    alert("Booking Created! ID: " + res.data.bookingId);
  };

  return (
    <div>
      <h1>Review Your Booking</h1>

      <input
        placeholder="Full Name"
        onChange={(e) => setUser({ ...user, fullName: e.target.value })}
      />

      <input
        placeholder="Email"
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />

      <input
        placeholder="Phone"
        onChange={(e) => setUser({ ...user, phone: e.target.value })}
      />

      <button onClick={handleSubmit}>Proceed to Payment</button>
    </div>
  );
};

export default ReviewBooking;
