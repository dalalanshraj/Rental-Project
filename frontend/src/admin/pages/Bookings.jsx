import { useEffect, useState } from "react";
import api from "../../api/axios";

const statusColor = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const paymentColor = (paid) =>
  paid
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-700";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const load = () => {
    api.get("/bookings").then((res) => {
      setBookings(res.data);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const update = (id, status) => {
    api.put(`/bookings/${id}/status`, { status }).then(load);
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this booking?")) return;

    await api.delete(`/bookings/${id}`);

    setBookings(prev => prev.filter(b => b._id !== id));

  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Booking Management
      </h1>

      {/* GRID */}
      <div className="space-y-6">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            {/* LEFT SECTION */}
            <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold text-[17px] text-gray-900">
                  {b.user?.firstName} {b.user?.lastName}
                </p>
                <p> <b>Booking:</b>{" "}
                  {new Date(b.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}</p>
                <p> <b>Email: </b>{b.user?.email}</p>
              </div>

              <div>
                <p><b>Property:</b> {b.property?.property.title}</p>
                <p><b>Guests:</b> {b.guests}</p>
                <p><b>Nights:</b> {b.nights}</p>
              </div>

              <div>
                <p><b>Total:</b> ${b.pricing?.total}</p>

                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${b.payment?.paid
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    }`}
                >
                  {b.payment?.paid ? "Payment Paid" : "Payment Pending"}
                </span>

                <span
                  className={`inline-block mt-2 ml-2 px-3 py-1 text-xs font-medium rounded-full ${b.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : b.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {b.status}
                </span>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedBooking(b)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm transition"
              >
                Details
              </button>
              <button
                onClick={() => handleDelete(b._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

              {b.status === "pending" && (
                <>
                  <button
                    onClick={() => update(b._id, "confirmed")}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => update(b._id, "cancelled")}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm transition"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Booking Details
            </h2>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <p><b>Name:</b> {selectedBooking.user?.firstName} {selectedBooking.user?.lastName}</p>
              <p><b>Email:</b> {selectedBooking.user?.email}</p>
              <p><b>Phone:</b> {selectedBooking.user?.phone}</p>
              <p><b>Guests:</b> {selectedBooking.guests}</p>

              <p><b>Property:</b> {selectedBooking.property?.property.title}</p>
              <p><b>Nights:</b> {selectedBooking.nights}</p>

              <p><b>Check-In:</b> {new Date(selectedBooking.checkIn).toLocaleDateString()}</p>
              <p><b>Check-Out:</b> {new Date(selectedBooking.checkOut).toLocaleDateString()}</p>

              {selectedBooking.pricing?.extraFees?.length > 0 &&
                selectedBooking.pricing.extraFees
                  .filter(f => f.option === "mandatory")
                  .map((fee, i) => (
                    <p key={i}>
                      <b>{fee.name}:</b> ${fee.amount}
                    </p>
                  ))}

              <p className="col-span-2 text-lg font-semibold text-black">
                Total: ${selectedBooking.pricing?.total}
              </p>

              <p>
                <b>Payment:</b>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${paymentColor(
                    selectedBooking.payment?.paid
                  )}`}
                >
                  {selectedBooking.payment?.paid ? "Paid" : "Pending"}
                </span>
              </p>

              <p>
                <b>Status:</b>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[selectedBooking.status]}`}
                >
                  {selectedBooking.status}
                </span>
              </p>
            </div>

            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-8 bg-gray-800 hover:bg-black text-white w-full py-3 rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;