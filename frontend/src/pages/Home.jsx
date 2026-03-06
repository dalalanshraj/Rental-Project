import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import api from "axios";
import FeaturedActivities from "../components/homeSection/FeaturedActivities";
import DiscoverDestinSection from "../components/homeSection/DiscoverDestin";
// import PropertiesSection from "../components/homeSection/PropertiesSection";
import PropertyCalendar from "../components/PropertyCalendar";
import PropertyCard from "../components/PropertyCard";
import DatePicker from "react-datepicker";

const HeroSection = () => {
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "1",
    bathroom: 1
  });
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [availableProperties, setAvailableProperties] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  // 🔹 SIMPLE SEARCH FUNCTION YOU REQUESTED
  const handleSearch = (e) => {
    e.preventDefault();

    if (!formData.checkIn || !formData.checkOut) {
      setError("Please Select Both Dates");
      setShowModal(true);
      return;
    }

    const params = new URLSearchParams({
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
    }).toString();

    navigate(`/results?${params}`);
  };
  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showModal]);

  return (
    <>
      <section className="relative h-[100vh] w-full flex flex-col justify-center items-center text-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-[-1]"
        >
          <source
            src="https://www.coastaldreamrentals.com/img/header-videos.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute bg-[#00000031] inset-0 bg-opacity-40 z-0"></div>

        <div className="z-10 text-white px-4">
          <h1 className="text-5xl md:text-7xl font-cursive mb-4">
            Sunny Florida Vacation Rentals
          </h1>
          <p className="text-lg md:text-xl mb-8 font-light">
            Rental Property Management and Vacation Rentals in Okaloosa and Walton County
          </p>

          {/* 🔹 Search Form */}
          <form
            onSubmit={handleSearch}
            className="bg-white text-black rounded-xl shadow-md p-4 flex flex-col md:flex-row items-center gap-3 md:gap-2 max-w-4xl mx-auto"
          >
            <DatePicker
              selected={formData.checkIn ? new Date(formData.checkIn) : null}
              onChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  checkIn: formatDate(date),
                }))
              }
              placeholderText="Check In"
              className="border p-2 rounded w-full"
              minDate={new Date()}
            />

            <DatePicker
              selected={formData.checkOut ? new Date(formData.checkOut) : null}
              onChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  checkOut: formatDate(date),
                }))
              }
              placeholderText="Check Out"
              className="border p-2 rounded w-full"
              minDate={formData.checkIn ? new Date(formData.checkIn) : new Date()}
            />

            <select
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/4"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} Guest{i > 0 ? "s" : ""}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-sky-700 text-white rounded-lg px-6 py-2 w-full md:w-auto hover:bg-sky-800 transition"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* <PropertiesSection /> */}
      <FeaturedActivities />
      <DiscoverDestinSection />
      <PropertyCalendar />
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center 
                  bg-white/30 backdrop-blur-sm z-50
                  animate-fadeIn">

          <div className="bg-white p-6 rounded-xl shadow-2xl w-100 text-center
                    transform transition-all duration-300
                    scale-100 opacity-100 animate-scaleIn">

            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Notice
            </h2>

            <p className="text-gray-700 mb-6 text-2xl">{error}</p>

            <button
              onClick={() => setShowModal(false)}
              className="bg-red-500 text-white px-6 py-2 rounded-lg 
                   hover:bg-red-600 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroSection;
