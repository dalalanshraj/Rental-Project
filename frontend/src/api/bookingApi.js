 import axios from "axios";

export const previewBooking = (data) =>
  axios.post("http://localhost:5000api/bookings/preview", data);

export const confirmBooking = (data) =>
  axios.post("http://localhost:5000api/bookings/confirm", data);
