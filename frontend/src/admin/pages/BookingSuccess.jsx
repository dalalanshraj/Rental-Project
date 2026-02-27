import { useLocation, useNavigate } from "react-router-dom";

const BookingSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl">No booking found</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-blue-600"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow p-8 rounded max-w-md text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-3">
          Booking Successful 🎉
        </h1>

        <p className="text-gray-700 mb-2">
          {state.message}
        </p>

        <p className="text-sm text-gray-500 mb-4">
          Booking ID: <b>{state.bookingId}</b>
        </p>

        <div className="bg-yellow-50 border border-yellow-300 p-3 rounded text-sm mb-4">
          ⏳ Your booking is <b>pending approval</b>.  
          Admin will review and confirm shortly.
        </div>

        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-5 py-2 rounded"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default BookingSuccess;
