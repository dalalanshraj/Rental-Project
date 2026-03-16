import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import dayjs from "dayjs";

export default function ProCalendar({ listingId }) {
  const [calendar, setCalendar] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const res = await api.get(`/listings/${listingId}/calendar`);
        console.log("API CALENDAR RESPONSE:", res.data);
        setCalendar(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Calendar fetch error:", err);
        setCalendar([]);
      }
    };

    if (listingId) fetchCalendar();
  }, [listingId]);

  console.log("listingId frontend:", listingId);
  console.log("calendar state frontend:", calendar);

  const start = currentMonth.startOf("month");
  const end = currentMonth.endOf("month");

  const days = [];
  const startDay = start.day() === 0 ? 6 : start.day() - 1;

  for (let i = 0; i < startDay; i++) days.push(null);

  for (let d = 1; d <= end.date(); d++) {
    days.push(dayjs(new Date(currentMonth.year(), currentMonth.month(), d)));
  }

  const getEntry = (date) => {
    return calendar.find(
      (c) => dayjs(c.date).format("YYYY-MM-DD") === dayjs(date).format("YYYY-MM-DD")
    );
  };

  return (
    
    <div className="bg-white shadow rounded-xl p-6 mt-10">
       <div className="text-3xl text-red-600 font-bold">
    TEST CALENDAR
  </div>
      <div className="mb-4 text-sm text-red-500">
        Calendar entries: {calendar.length}
      </div>

      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}>
          ◀
        </button>

        <h2 className="text-xl font-bold">{currentMonth.format("MMMM YYYY")}</h2>

        <button onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}>
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 text-center font-semibold mb-2">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, i) => {
          if (!date) return <div key={i}></div>;

          const entry = getEntry(date);

          let style = "bg-green-200";

          if (entry?.status === "R") {
            style = "bg-red-500 text-white";
          } else if (entry?.status === "H") {
            style = "bg-gradient-to-r from-red-500 to-green-200 text-white";
          }

          return (
            <div
              key={i}
              className={`h-20 rounded p-1 text-xs relative ${style}`}
            >
              <div className="text-right">{date.date()}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 