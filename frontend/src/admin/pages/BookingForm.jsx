import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

const BookingForm = ({ bookingData }) => {
  const navigate = useNavigate();

  const handleBooking = async () => {
    try {
      const res = await api.post("/bookings/create", bookingData);

      navigate("/booking-success", {
        state: {
          bookingId: res.data.bookingId,
          message: res.data.message,
        },
      });
    } catch (err) {
      alert("Booking failed");
    }
  };

  return (
    <button
      onClick={handleBooking}
      className="bg-black text-white px-4 py-2"
    >
      Confirm Booking
    </button>
  );
};

export default BookingForm;
