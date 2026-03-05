import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../api/axios.js";

// normalize date (timezone bug fix)
const normalize = (d) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export default function ListingCalendar({
  listingId,
  checkIn,
  checkOut,
  setCheckIn,
  setCheckOut,
}) {
  const [blockedDates, setBlockedDates] = useState([]);

  // ============================
  // FETCH CALENDAR
  // ============================
  useEffect(() => {
    if (!listingId) return;

    api
      .get(`/listings/${listingId}/calendar`)
      .then((res) => {
        const blocked = res.data
          .filter((d) => d.status === "R" || d.status === "H")
          .map((d) => normalize(new Date(d.date)));

        setBlockedDates(blocked);
      })
      .catch(console.error);
  }, [listingId]);

  // ============================
  // DISABLE BOOKED DATES
  // ============================
  const isDateBlocked = (date) =>
    blockedDates.some(
      (d) => d.getTime() === normalize(date).getTime()
    );

  return (
    <div className="space-y-3">
      {/* CHECK IN */}
      <DatePicker
        selected={checkIn}
        onChange={(date) => {
          setCheckIn(date);
          setCheckOut(null);
        }}
        placeholderText="Check-in"
        minDate={new Date()}
        filterDate={(date) => !isDateBlocked(date)}
        className="border p-3 rounded w-full"
      />

      {/* CHECK OUT */}
      <DatePicker
        selected={checkOut}
        onChange={(date) => setCheckOut(date)}
        placeholderText="Check-out"
        minDate={checkIn || new Date()}
        filterDate={(date) =>
          !isDateBlocked(date) &&
          (!checkIn || date > checkIn)
        }
        className="border p-3 rounded w-full"
      />
    </div>
  );
}
