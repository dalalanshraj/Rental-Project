import { useState } from "react";
import api from "../api/axios.js";

export default function ReviewModal({ listingId, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: 0,
    title: "",
    message: "",
    stayDate: "",
  });

  const submitReview = async () => {
    try {
      await api.post(
        `/listings/${listingId}/reviews`,
        form
      );

      alert("Review submitted for approval");
      onClose();
    } catch {
      alert("Failed to submit review");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white p-6 rounded-xl w-full max-w-lg">

        <h2 className="text-2xl font-bold mb-4">
          Write a Review
        </h2>

        <input
          placeholder="Name"
          className="border p-2 w-full mb-3"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          className="border p-2 w-full mb-3"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* STAR RATING */}
        <div className="flex gap-2 mb-3">
          {[1,2,3,4,5].map((star) => (
            <button
              key={star}
              onClick={() =>
                setForm({ ...form, rating: star })
              }
              className={
                form.rating >= star
                  ? "text-yellow-400 text-2xl"
                  : "text-gray-300 text-2xl"
              }
            >
              ★
            </button>
          ))}
        </div>

        <input
          placeholder="Review title"
          className="border p-2 w-full mb-3"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          placeholder="Message"
          className="border p-2 w-full mb-3"
          rows="4"
          value={form.message}
          onChange={(e) =>
            setForm({ ...form, message: e.target.value })
          }
        />

        <input
          type="date"
          className="border p-2 w-full mb-4"
          value={form.stayDate}
          onChange={(e) =>
            setForm({ ...form, stayDate: e.target.value })
          }
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={submitReview}
            className="bg-[#185089] text-white px-6 py-2 rounded"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}
