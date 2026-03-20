import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../api/axios.js";


// ==============================
// DATE HELPERS
// ==============================
const normalizeDate = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const formatLocalDate = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

const toLocal = (val) => {
  const d = new Date(val);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

export default function CalendarTab({ listingId }) {
  const [calendar, setCalendar] = useState([]);
  const [calendarMap, setCalendarMap] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState("H");
  const [loading, setLoading] = useState(false);

  // ==============================
  // LOAD CALENDAR
  // ==============================
  useEffect(() => {
    if (!listingId) return;

    const fetchCalendar = async () => {
      try {
        const res = await api.get(`/listings/${listingId}/calendar`);
        const data = Array.isArray(res.data) ? res.data : [];

        setCalendar(data);

        //  FAST MAP
        const map = {};
        data.forEach((c) => {
          map[formatLocalDate(toLocal(c.date))] = c;
        });

        setCalendarMap(map);
      } catch (err) {
        console.error(err);
        setCalendar([]);
        setCalendarMap({});
      }
    };

    fetchCalendar();
  }, [listingId]);

  // ==============================
  // HANDLE DATE CLICK
  // ==============================
const handleDayClick = (date) => {
  const clicked = normalizeDate(date);

  //  first click
  if (!startDate) {
    setStartDate(clicked);
    setEndDate(null); // ❗ IMPORTANT
    return;
  }

  //  second click
  if (!endDate) {
    if (clicked < startDate) {
      setStartDate(clicked);
      setEndDate(startDate);
    } else {
      setEndDate(clicked);
    }
    return;
  }

  //  reset selection
  setStartDate(clicked);
  setEndDate(null);
};

  // ==============================
  // REFRESH CALENDAR
  // ==============================
  const refreshCalendar = async () => {
    const res = await api.get(`/listings/${listingId}/calendar`);
    const data = Array.isArray(res.data) ? res.data : [];

    setCalendar(data);

    const map = {};
    data.forEach((c) => {
      map[formatLocalDate(toLocal(c.date))] = c;
    });

    setCalendarMap(map);
  };

  // ==============================
  // BLOCK
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
  }
);
      await refreshCalendar();
      setStartDate(null);
      setEndDate(null);
    } catch {
      alert("Failed to block dates");
      // console.log("TOKEN:", localStorage.getItem("token"));
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // UNBLOCK
  // ==============================
  const unblockDates = async () => {
  if (!startDate || !endDate) {
    alert("Select start & end date");
    return;
  }

  setLoading(true);

  try {
    await api.post(
      `/listings/${listingId}/calendar/unblock`, // ✅ FIXED
      {
        startDate: formatLocalDate(startDate),
        endDate: formatLocalDate(endDate),
      }
    );

    await refreshCalendar();
    setStartDate(null);
    setEndDate(null);
  } catch {
    alert("Failed to unblock dates");
  } finally {
    setLoading(false);
  }
};

  // ==============================
  // TILE STYLE
  // ==============================
  const tileClassName = ({ date }) => {
    const d = normalizeDate(date);
    const key = formatLocalDate(d);

   if (startDate && !endDate && d.getTime() === startDate.getTime()) {
  return "bg-blue-400 text-white rounded-lg";
}

if (startDate && endDate && d >= startDate && d <= endDate) {
  return "bg-blue-400 text-white rounded-lg";
}

    const found = calendarMap[key];

    if (!found) return "";

    if (found.status === "R") return "bg-red-500 text-white rounded-lg";
    if (found.status === "H") return "bg-yellow-400 text-black rounded-lg";

    return "";
  };

  // ==============================
  // UI
  // ==============================
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-xl border border-gray-200">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          📅 Availability Calendar
        </h2>

        <div className="flex gap-3 text-sm">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-300 rounded"></div> Available
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div> Reserved
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-400 rounded"></div> Hold
          </span>
        </div>
      </div>

      {/* CALENDAR */}
      <div className="bg-white rounded-xl p-4 shadow-inner border">
        <Calendar
          onClickDay={handleDayClick}
          tileClassName={tileClassName}
          minDate={new Date()}
          className="w-full border-none text-sm"
        />
      </div>

      {/* CONTROLS */}
      <div className="mt-6 space-y-5">

        <div className="flex items-center gap-4">
          <label className="font-semibold text-gray-700">
            Block as:
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          >
            <option value="H">🟡 Hold / Maintenance</option>
            <option value="R">🔴 Reserved</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            onClick={blockDates}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold shadow-md"
          >
            🚫 Block Dates
          </button>

          <button
            onClick={unblockDates}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold shadow-md"
          >
            ✅ Unblock Dates
          </button>
        </div>

        {startDate && endDate && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm">
            Selected:
            <span className="font-semibold ml-1">
              {formatLocalDate(startDate)}
            </span>
            {" → "}
            <span className="font-semibold">
              {formatLocalDate(endDate)}
            </span>
          </div>
        )}

      </div>
    </div>
  );
}