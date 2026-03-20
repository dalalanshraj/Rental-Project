import api from "../api/axios.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// -----------------------------------
// DATE FORMAT → yyyy-mm-dd
// -----------------------------------
const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function BookingPreviewModal({
  propertyId,
  checkIn,
  checkOut,
  onClose,
}) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -----------------------------------
  // LOAD PREVIEW
  // -----------------------------------
  useEffect(() => {
    if (!propertyId || !checkIn || !checkOut) return;

    setLoading(true);
    setError("");

    api
      .post("/bookings/preview", {
        propertyId,
        checkIn: formatDate(checkIn),
        checkOut: formatDate(checkOut),
      })
      .then((res) => {
        setPreview(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Preview Error:", err.response?.data);
        setError(
          err.response?.data?.error ||
          "Unable to calculate booking price"
        );
        setLoading(false);
      });
  }, [propertyId, checkIn, checkOut]);

  // -----------------------------------
  // LOADING / ERROR
  // -----------------------------------
  
  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl max-w-md w-full">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            onClick={onClose}
            className="w-full bg-gray-800 text-white py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!preview) return null;

  // -----------------------------------
  // UI
  // -----------------------------------
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      {/* ✅ MODAL BOX */}
      <div
        className="bg-white rounded-2xl w-full max-w-xl p-6 relative"
        onClick={(e) => e.stopPropagation()} //  IMPORTANT
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 text-xl rounded-full w-10 h-10 flex items-center justify-center"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6">
          Booking Summary
        </h2>

        {/* PRICE BREAKDOWN */}
        <div className="space-y-3 text-gray-700">
          <div className="flex justify-between">
            <span>Rental rate</span>
            <span>
              ${preview.subtotal} ({preview.nights} nights)
            </span>
          </div>

          {preview.extraFees?.length > 0 &&
  preview.extraFees
    .filter(f => f.option === "mandatory")
    .map((fee, i) => (
      <div key={i} className="flex justify-between">
        <span>{fee.name}</span>
        <span>${fee.amount}</span>
      </div>
))}

          <div className="flex justify-between text-xl font-bold">
            <span>Estimated total due</span>
            <span>${preview.total}</span>
          </div>
        </div>

      <Link
  to={`/BookingPage?propertyId=${propertyId}&checkIn=${formatDate(
    checkIn
  )}&checkOut=${formatDate(checkOut)}`}
>
  <button className="bg-blue-600 text-white w-full py-3 mt-6 rounded-xl">
    Review and Book
  </button>
</Link>

      </div>
    </div>
  );
}
