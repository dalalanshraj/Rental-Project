import { useState, useEffect } from "react";
import axios from "axios";
import api from "../api/axios";

export default function ReviewModal({ onClose }) {
  const [listings, setListings] = useState([]);

  const [form, setForm] = useState({
    listingId: "",
    name: "",
    email: "",
    rating: 5,
    title: "",
    message: "",
    stayDate: "",
  });

  // ✅ FETCH LISTINGS (PUBLIC ROUTE)
  useEffect(() => {
    api
      .get("/listings/public")
      .then((res) => {
        // console.log(" LISTINGS 👉", res.data);
        setListings(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // ✅ SUBMIT REVIEW
  const handleSubmit = async () => {
    if (!form.listingId) {
      alert("Please select a property");
      return;
    }

    try {
      await api.post(
        `/listings/${form.listingId}/reviews`,
        {
          name: form.name,
          email: form.email,
          rating: form.rating,
          title: form.title,
          message: form.message,
          stayDate: form.stayDate,
        }
      );

      alert("Review submitted for approval!");
      onClose();
    } catch (err) {
      console.error("Submit Error 👉", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px]">

        <h2 className="text-xl font-semibold mb-4">Write a Review</h2>

        {/* ✅ SELECT PROPERTY */}
       <select
  className="w-full border border-gray-300 p-2 mb-3 rounded bg-white text-black"
  value={form.listingId}
  onChange={(e) =>
    setForm({ ...form, listingId: e.target.value })
  }
>
  <option value="">Select Property</option>

  {listings.map((item) => (
    <option key={item._id} value={item._id}>
      {item.title || item.property?.title}
    </option>
  ))}
</select>
        <input  
          placeholder="Name"
          className="w-full border p-2 mb-2 rounded"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          className="w-full border p-2 mb-2 rounded"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          placeholder="Review Title"
          className="w-full border p-2 mb-2 rounded"
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          placeholder="Message"
          className="w-full border p-2 mb-2 rounded"
          onChange={(e) =>
            setForm({ ...form, message: e.target.value })
          }
        />

        <input
          type="date"
          className="w-full border p-2 mb-3 rounded"
          onChange={(e) =>
            setForm({ ...form, stayDate: e.target.value })
          }
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Submit Review
        </button>

        <button
          onClick={onClose}
          className="mt-2 w-full border py-2 rounded"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}