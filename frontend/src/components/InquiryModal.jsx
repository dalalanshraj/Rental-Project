import axios from "axios";
import { useState } from "react";

export default function InquiryModal({ propertyId, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [propertyTitle, setPropertyTitle] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const res = await axios.post("http://localhost:8000/api/inquiries", {
      ...form,
      propertyId,
    });

    setPropertyTitle(res.data.inquiry.property.title);
    setSuccess("Inquiry sent successfully!");
    setForm({ name: "", email: "", phone: "", message: "" });

  } catch (err) {
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md p-6 relative top-20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-200 rounded-full w-9 h-9 flex items-center justify-center"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">Send Inquiry</h2>

       {success && (
  <p className="bg-green-100 text-green-700 p-3 rounded mb-3 text-center">
    Inquiry sent for <strong>{propertyTitle}</strong>
  </p>
)}


        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            rows="4"
            value={form.message}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold ${
              loading ? "bg-gray-400" : "bg-[#185089] hover:bg-[#123b66]"
            }`}
          >
            {loading ? "Sending..." : "Submit Inquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}
