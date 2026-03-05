import api from "../api/axios.js";
import { useEffect, useState } from "react";

const BookingPopup = ({ property, checkIn, checkOut, close }) => {
  const [nights, setNights] = useState(0);
  const [pricing, setPricing] = useState({
    base: 0,
    cleaning: 0,
    service: 0,
    tax: 0,
    total: 0
  });

  useEffect(() => {
    let start = new Date(checkIn);
    let end = new Date(checkOut);
    let diff = (end - start) / (1000 * 60 * 60 * 24);

    setNights(diff);

    const base = property.basePricePerNight * diff;
    const cleaning = property.cleaningFee;
    const service = (property.serviceFeePercent / 100) * base;
    const tax = (property.taxesPercent / 100) * base;

    setPricing({
      base,
      cleaning,
      service,
      tax,
      total: base + cleaning + service + tax
    });
  }, []);

  const handleReserve = async () => {
    const payload = {
      propertyId: property._id,
      checkIn,
      checkOut,
      guests: 1
    };

    const res = await api.post("/bookings/create", payload);

    alert("Booking Created!");
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>{property.title}</h2>

        <p><b>Check-in:</b> {checkIn}</p>
        <p><b>Check-out:</b> {checkOut}</p>
        <p><b>Nights:</b> {nights}</p>

        <h3>Price Breakdown</h3>

        <p>Base Price: ${pricing.base}</p>
        <p>Cleaning Fee: ${pricing.cleaning}</p>
        <p>Service Fee: ${pricing.service}</p>
        <p>Tax: ${pricing.tax}</p>

        <h2>Total: ${pricing.total}</h2>

        <button onClick={handleReserve}>Reserve Now</button>
        <button onClick={close}>Close</button>
      </div>
    </div>
  );
};

export default BookingPopup;
