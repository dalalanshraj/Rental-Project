import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import dayjs from "dayjs";

export default function ProCalendar({ listingId }) {
  const [calendar, setCalendar] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs());

 useEffect(() => {
  api
    .get(`/listings/${listingId}/calendar`)
    .then((res) => {
      const data = Array.isArray(res.data) ? res.data : [];
      setCalendar(data);
    })
    .catch((err) => {
      console.log("Calendar API error:", err);
      setCalendar([]);
    });
}, [listingId]);

  const start = currentMonth.startOf("month");
  const end = currentMonth.endOf("month");

  const days = [];
  for (let i = 0; i < start.day(); i++) days.push(null);

  for (let d = 1; d <= end.date(); d++) {
    days.push(currentMonth.date(d));
  }

  // find if booked
 const isBooked = (date) =>
  Array.isArray(calendar) &&
  calendar.find(
    (c) =>
      dayjs(c.date).format("YYYY-MM-DD") ===
        dayjs(date).format("YYYY-MM-DD") &&
      c.status === "R"
  );

  // 🔥 TURNOVER LOGIC
  const isTurnover = (date) => {
    const prevBooked = isBooked(dayjs(date).subtract(1, "day"));
    const nextBooked = isBooked(dayjs(date).add(1, "day"));

    const todayBooked = isBooked(date);

    if (!todayBooked && (prevBooked || nextBooked)) {
      return true;
    }

    return false;
  };

  return (
    <div className="bg-white shadow rounded-xl p-6 mt-10">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() =>
            setCurrentMonth(currentMonth.subtract(1, "month"))
          }
        >
          ◀
        </button>

        <h2 className="text-xl font-bold">
          {currentMonth.format("MMMM YYYY")}
        </h2>

        <button
          onClick={() =>
            setCurrentMonth(currentMonth.add(1, "month"))
          }
        >
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

          let style = "bg-green-200";

          if (isBooked(date)) {
            style = "bg-red-500 text-white";
          }

          else if (isTurnover(date)) {
            style =
              "bg-gradient-to-r from-red-500 to-green-200 text-white";
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

      <div className="flex gap-6 mt-6 text-sm">
        <div className="flex gap-2 items-center">
          <div className="w-4 h-4 bg-green-300"></div> Available
        </div>

        <div className="flex gap-2 items-center">
          <div className="w-4 h-4 bg-red-500"></div> Booked
        </div>

        <div className="flex gap-2 items-center">
          <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-green-300"></div>
          Turnover
        </div>
      </div>
    </div>
  );
}
