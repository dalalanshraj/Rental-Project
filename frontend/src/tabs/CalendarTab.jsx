import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../api/axios.js";

// ==============================
// DATE HELPERS (VERY IMPORTANT)
// ==============================
const normalizeDate = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const formatLocalDate = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

export default function CalendarTab({ listingId }) {
  const [calendar, setCalendar] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState("H"); // H = Hold, R = Reserved
  const [loading, setLoading] = useState(false);

  // ==============================
  // LOAD CALENDAR
  // ==============================
  useEffect(() => {
    if (!listingId) return;

    api
      .get(`/listings/${listingId}/calendar`)
      .then((res) => setCalendar(res.data))
      .catch(console.error);
  }, [listingId]);

  // ==============================
  // HANDLE DATE CLICK (SLOW + SAFE)
  // ==============================
  const handleDayClick = (date) => {
    const clicked = normalizeDate(date);

    // first click
    if (!startDate) {
      setStartDate(clicked);
      setEndDate(null);
      return;
    }

    // second click
    if (!endDate) {
      if (clicked < startDate) {
        setStartDate(clicked);
      } else {
        setEndDate(clicked);
      }
      return;
    }

    // reset selection
    setStartDate(clicked);
    setEndDate(null);
  };

  // ==============================
  // BLOCK SELECTED RANGE
  // ==============================
  const blockDates = async () => {
    if (!startDate || !endDate) {
      alert("Select start & end date");
      return;
    }

    setLoading(true);

    try {
      await api.post(
        `/listings/${listingId}/calendar/block`,
        {
          startDate: formatLocalDate(startDate),
          endDate: formatLocalDate(endDate),
          status,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const res = await api.get(
        `/listings/${listingId}/calendar`
      );
      setCalendar(res.data);

      setStartDate(null);
      setEndDate(null);
    } catch (err) {
      alert("Failed to block dates");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // UNBLOCK SELECTED RANGE
  // ==============================
  const unblockDates = async () => {
    if (!startDate || !endDate) {
      alert("Select start & end date");
      return;
    }

    setLoading(true);

    try {
      await api.post(
        `/listings/${listingId}/calendar/unblock`,
        {
          startDate: formatLocalDate(startDate),
          endDate: formatLocalDate(endDate),
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const res = await api.get(
        `/listings/${listingId}/calendar`
      );
      setCalendar(res.data);

      setStartDate(null);
      setEndDate(null);
    } catch (err) {
      alert("Failed to unblock dates");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // TILE STYLING (BUG FREE)
  // ==============================
  const tileClassName = ({ date }) => {
    const d = normalizeDate(date);
    const dayStr = formatLocalDate(d);

    // Selected range
    if (startDate && endDate && d >= startDate && d <= endDate) {
      return "bg-blue-300 text-black";
    }

    const found = calendar.find(
      (c) =>
        formatLocalDate(new Date(c.date)) === dayStr
    );

    if (!found) return "";

    if (found.status === "R") return "bg-red-500 text-yellow-500";
    if (found.status === "H") return "bg-yellow-400";

    return "";
  };

  // ==============================
  // UI
  // ==============================
  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-2xl font-bold mb-4">
        Availability Calendar
      </h2>

      <Calendar
        onClickDay={handleDayClick}
        tileClassName={tileClassName}
        minDate={new Date()}
      />

      {/* CONTROLS */}
      <div className="mt-6 space-y-3">

        <div className="flex gap-4">
          <label className="font-medium">Block as:</label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-3 py-2 "
          >
            <option value="H">Hold / Maintenance</option>
            <option value="R">Reserved</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={blockDates}
            disabled={loading}
            className="bg-red-600 text-white px-5 py-2 rounded-lg cursor-pointer"
          >
            Block Dates
          </button>

          <button
            onClick={unblockDates}
            disabled={loading}
            className="bg-green-600 text-white px-5 py-2 rounded-lg cursor-pointer"
          >
            Unblock Dates
          </button>
        </div>

        {startDate && endDate && (
          <p className="text-sm text-gray-600">
            Selected:{" "}
            <b>{formatLocalDate(startDate)}</b> →{" "}
            <b>{formatLocalDate(endDate)}</b>
          </p>
        )}
      </div>
    </div>
  );
}
