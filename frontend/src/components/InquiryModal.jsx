import api from "../api/axios.js";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from "react-icons/io";

export default function InquiryModal({ propertyId, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    Arrival: null,
    Departure: null,
    Adults: "",
    Kids: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [propertyTitle, setPropertyTitle] = useState("");

  // 🔒 Lock background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!form.Arrival || !form.Departure) {
      setError("Please select arrival and departure dates");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/inquiries", {
        ...form,
        Arrival: form.Arrival.toISOString(),
        Departure: form.Departure.toISOString(),
        propertyId,
      });

      setPropertyTitle(res.data.inquiry.property.title);
      setSuccess("Inquiry sent successfully!");

      setForm({
        name: "",
        email: "",
        phone: "",
        Arrival: null,
        Departure: null,
        Adults: "",
        Kids: "",
        message: "",
      });

      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-start z-100 pt-34 px-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-[50%] h-[87%]  p-8 relative mt-16 shadow-2xl border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-full w-10 h-10 flex items-center justify-center transition cursor-pointer"
        >
          <IoMdClose />
        </button>

        <h2 className="text-3xl font-bold mb-5 text-gray-800">
          Send Inquiry
        </h2>

        {/* SUCCESS */}
        {success && (
          <p className="bg-green-100 border border-green-300 text-green-700 p-3 rounded-xl mb-4 text-center">
            Inquiry sent for <strong>{propertyTitle}</strong>
          </p>
        )}

        {/* ERROR */}
        {error && (
          <p className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-xl mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-1">

          {/* NAME + EMAIL */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* PHONE */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          {/* DATE PICKER */}
          <div className="grid grid-cols-2 gap-1">
            <DatePicker
              selected={form.Arrival}
              onChange={(date) =>
                setForm({ ...form, Arrival: date })
              }
              placeholderText="Arrival Date"
              className="w-full border border-gray-300 p-3 rounded-xl"
              dateFormat="dd-MM-yyyy"
              minDate={new Date()}

            />

            <DatePicker
              selected={form.Departure}
              onChange={(date) =>
                setForm({ ...form, Departure: date })
              }
              placeholderText="Departure Date"
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              dateFormat="dd-MM-yyyy"
              minDate={form.Arrival || new Date()}
            />
          </div>

          {/* GUESTS */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="Adults"
              placeholder="Adults"
              value={form.Adults}
              onChange={handleChange}
              required
              min="1"
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="number"
              name="Kids"
              placeholder="Kids"
              value={form.Kids}
              onChange={handleChange}
              min="0"
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* MESSAGE */}
          <textarea
            name="message"
            placeholder="Your Message"
            rows="4"
            value={form.message}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 cursor-pointer rounded-xl text-white font-semibold shadow-md transition ${loading
                ? "bg-gray-400"
                : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
              }`}
          >
            {loading ? "Sending..." : "Submit Inquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}