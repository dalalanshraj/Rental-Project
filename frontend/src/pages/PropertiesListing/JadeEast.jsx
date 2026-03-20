import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PropertyGallery from "../../components/PropertyGallery";
import { MdFamilyRestroom, MdOutlineDoorBack } from "react-icons/md";
import { LuBath } from "react-icons/lu";
import { FaRegBuilding } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";

// import ReviewsSection from "../../components/ReviewsSection";

const mapSrc =
  "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6542.167370522866!2d-86.61702000000001!3d30.397547!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88913f2be92a8295%3A0x10c13fdf4734afaa!2sOkaloosa%20Island%20Beach%20Access%20Four%2C%20Jerry%20Melvin%20Beachwalk!5e1!3m2!1sen!2sin!4v1761776961400!5m2!1sen!2sin";

const JadeEastFront = () => {
  const [formData, setFormData] = useState({
    checkIn: null,
    checkOut: null,
    guests: 1,
  });

  const [preview, setPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const propertyId = "68f7edf6fa0cfc5e57cebea4";
  // const [couponCode, setCouponCode] = useState("");

  // Convert JS date → yyyy-mm-dd
  const formatDate = (date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  // Open Preview Modal
  const openPreviewModal = async () => {
    if (!formData.checkIn || !formData.checkOut) {
      alert("Please select dates first");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/bookings/preview",
        {
          propertyId: "68f7edf6fa0cfc5e57cebea4",
          checkIn: formatDate(formData.checkIn),
          checkOut: formatDate(formData.checkOut),
        }
      );

      setPreview(response.data);   // <-- Important
      setShowModal(true);          // <-- Modal open
    } catch (err) {
      alert("Preview failed");
    } finally {
      setLoading(false);
    }
  };


  // Apply Coupon
  const applyCoupon = async () => {
    if (!couponCode) return;

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/api/bookings/preview", {
        propertyId: "68f7edf6fa0cfc5e57cebea4",
        checkIn: formatDate(formData.checkIn),
        checkOut: formatDate(formData.checkOut),
        coupon: couponCode,
      });

      setPreview(response.data);
    } catch (err) {
      alert(err.response?.data?.error || "Invalid Coupon");
    } finally {
      setLoading(false);
    }
  };

  // Create Booking
  const createBooking = async () => {
    try {
      setLoading(true);

      const response = await axios.post("http://localhost:8000/api/bookings/create", {
        propertyId: "68f7edf6fa0cfc5e57cebea4",
        checkIn: formatDate(formData.checkIn),
        checkOut: formatDate(formData.checkOut),
        guests: formData.guests,
        totalPrice: preview.total,
        coupon: couponCode,
      });

      alert(`Booking Created! ID: ${response.data.bookingId}`);
      setShowModal(false);
    } catch (err) {
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };


  const images = [
    "https://www.coastaldreamrentals.com/img/property-img2/img-1.jpg",
    "https://www.coastaldreamrentals.com/img/property-img2/img-1.jpg",
    "https://www.coastaldreamrentals.com/img/property-img2/img-3.jpg",
    "https://www.coastaldreamrentals.com/img/property-img2/img-4.jpg",
  ];

  const Kitchen = [
    "Blender",
    "Can Opener",
    "Coffee Maker",
    "Counter",
    "Dishes",
    "Dishwasher",
    "Eat-in",
    "Garbage Disposal",
    "Microwave",
    "Pots",
    "Refrigerator",
    "Stove",
    "Toaster",
    "Utensils",
    "Eat at Bar 4 bar stools",
  ];

  const laundry = ["Ironing Board", "Linens", "Towels", "Washer/Dryer"];

  const inside = [
    "Cable",
    "Ceiling Fans",
    "Central Air",
    "Heat",
    "Internet",
    "TV",
    "Vacuum",
    "Wireless",
  ];

  const outside = [
    "BBQ Grill",
    "Community Pool",
    "Garage",
    "Hot Tub",
    "Outside Shower",
    "Wrap around balcony",
  ];

  const activity = [
    "Beach",
    "Canoe Rental",
    "Fishing",
    "Kayaking",
    "ParaSailing",
    "Restaurants",
    "Swimming",
  ];

  return (
    <>
      {/* GALLERY SECTION */}
      <div className="relative w-full">
        <PropertyGallery images={images} />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-20 -mt-20 max-w-7xl mx-auto mb-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-8">
          {/* TITLE CARD */}
          <div className="bg-white p-6 rounded-2xl shadow-xl relative z-30">
            <p className="text-gray-500 text-sm mb-2">
              Florida • Destin • PropertyID 7463
            </p>
            <h1 className="text-4xl font-bold mb-4">Jade East 210</h1>

            <div className="flex justify-between max-w-full text-center">
              <div>
                <div className="text-2xl">
                  <MdFamilyRestroom className="ml-4" />
                </div>
                <p className="text-black font-semibold">Sleeps </p>
              </div>

              <div>
                <div className="text-2xl">
                  <MdOutlineDoorBack className="ml-7" />
                </div>
                <p className="text-black font-semibold">Bedrooms 1</p>
              </div>

              <div>
                <div className="text-2xl">
                  <LuBath className="ml-7" />
                </div>
                <p className="text-black font-semibold">Bathrooms 1</p>
              </div>

              <div>
                <div className="text-2xl">
                  <FaRegBuilding className="ml-3" />
                </div>
                <p className="text-black font-semibold">Floors 1</p>
              </div>
            </div>

            {/* NAV LINKS */}
            <div className="sticky top-37 z-40 bg-white p-4 mt-10 rounded-2xl shadow-md">
              <div className="flex justify-between overflow-x-auto text-gray-600 font-medium">
                <a href="#Description">Description</a>
                <a href="#Amenities">Amenities</a>
                <a href="#Reviews">Reviews</a>
                <a href="#Video">Video</a>
                <a href="#Map">Map</a>
              </div>
            </div>

            {/* DESCRIPTION */}
           <div className="bg-white p-6 text-black">
  <h2 id="Description" className="text-2xl font-semibold mb-2">
    Description
  </h2>

  <p className="text-black leading-relaxed">
    <b>Your Dream Beach Escape Awaits at Jade East Towers 210</b>
    <br />
    Looking for the perfect family vacation spot? Jade East Towers has something
    for everyone — starting with the breathtaking Gulf beach just steps from your
    door.
    <br /><br />
    Unit #210 is bursting with personality, color, and comfort. From the moment
    you walk in, the vibrant decor, brand-new furniture, and coastal charm will
    lift your spirits. This beautifully refreshed 3-bedroom, 3-bathroom condo 
    features all-new flooring, a fully stocked kitchen, and a beachfront balcony 
    that invites you to relax and soak in the views.
    <br /><br />
    The master suite opens directly onto the private balcony overlooking the 
    beach and features a luxurious en-suite bathroom with custom tile work and an 
    oversized glass walk-in shower — perfect for a spa-like experience.
    <br /><br />
    Conveniently located on the 2nd floor, this condo gives you quick access to 
    the pool, hot tub, and beach, just one floor down! You’ll also enjoy in-unit 
    laundry, assigned parking, and access to tennis courts and a grilling area — 
    ideal for laid-back evenings with family and friends.
    <br /><br />
    Step outside the gated community and you'll find restaurants, coffee shops, 
    Big Kahuna’s Waterpark, and local shopping — all within walking distance. 
    With everything so close by, you’ll never run out of things to do.
    <br /><br />
    While CDR provides an initial supply of essentials to get you through your 
    first 24 hours — including toilet paper, paper towels, coffee filters, hand 
    soap, and trash bags — we recommend packing a few extra items:
  </p>

  <ul className="list-disc pl-6 text-black mt-3 space-y-1">
    <li>Extra toilet paper and paper towels</li>
    <li>Toiletries and personal items</li>
    <li>Condiments and spices</li>
    <li>Dishwashing pods and laundry detergent</li>
    <li>Coffee and filters</li>
    <li>Beach towels, toys, and sunscreen</li>
    <li>Anything else that makes your vacation amazing!</li>
  </ul>
</div>


            {/* AMENITIES */}
            <h2 id="Amenities" className="text-2xl font-semibold mb-2">
              Property Details
            </h2>

            {/* KITCHEN */}
            <h2 className="bg-[#185089] text-white p-3 rounded-2xl text-lg ml-3 mt-4">
              KITCHEN FEATURES
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-gray-700 pt-6 ml-10">
              {Kitchen.map((item, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <FaCheck className="w-5 h-5 text-gray-900" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* LAUNDRY */}
            <h2 className="bg-[#185089] text-white p-3 rounded-2xl text-lg ml-3 mt-4">
              LAUNDRY FEATURES
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-gray-700 pt-6 ml-10">
              {laundry.map((item, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <FaCheck className="w-5 h-5 text-gray-900" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* INSIDE */}
            <h2 className="bg-[#185089] text-white p-3 rounded-2xl text-lg ml-3 mt-4">
              INSIDE FEATURES
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-gray-700 pt-6 ml-10">
              {inside.map((item, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <FaCheck className="w-5 h-5 text-gray-900" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* OUTSIDE */}
            <h2 className="bg-[#185089] text-white p-3 rounded-2xl text-lg ml-3 mt-4">
              OUTSIDE FEATURES
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-gray-700 pt-6 ml-10">
              {outside.map((item, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <FaCheck className="w-5 h-5 text-gray-900" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* ACTIVITY */}
            <h2 className="bg-[#185089] text-white p-3 rounded-2xl text-lg ml-3 mt-4">
              ACTIVITY FEATURES
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-gray-700 pt-6 ml-10">
              {activity.map((item, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <FaCheck className="w-5 h-5 text-gray-900" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* VIDEO */}
            <iframe
              width="770"
              height="480"
              src="https://www.youtube.com/embed/LDH0qO8mfzE"
              title="Sea Dunes 404, Fort Walton Beach, FL"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>

            {/* MAP */}
            <div className="map-container pt-10 h-90">
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                title="Google Maps Location"
              ></iframe>
            </div>
          </div>
        </div>

        {/* RIGHT BOX */}
        <div className="relative">
          <div className="sticky top-38 bg-white shadow-lg rounded-2xl p-6">
            <div className="text-center mb-4">
              <div className="bg-sky-400 h-16 w-full rounded-t-xl relative">
                <img
                  src="https://www.coastaldreamrentals.com/img/property-img/owner.jpg"
                  alt="manager"
                  className="w-20 h-20 rounded-full border-4 border-white absolute left-1/2 transform -translate-x-1/2 top-6"
                />
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <div className="flex space-x-2">
                <DatePicker
                  selected={formData.checkIn}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, checkIn: date }))

                  }
                  placeholderText="Check In"
                  className="border p-2 rounded w-full"
                  minDate={new Date()}   //  disable past dates

                />

                <DatePicker
                  selected={formData.checkOut}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, checkOut: date }))
                  }
                  placeholderText="Check Out"
                  className="border p-2 rounded w-full"
                  minDate={formData.checkIn || new Date()}   //  checkout always after check-in
                />

              </div>

              <button className="bg-lime-500 text-white font-semibold w-full py-3 rounded-lg">
                Send Inquiry
              </button>

              <button
                className="bg-blue-500 text-white w-full py-3 rounded-lg"
                onClick={openPreviewModal}
              >
                {loading ? "Loading..." : "Book Now"}
              </button>
            </div>

            <div className="text-center mt-6 border-t pt-4">
              <p className="font-semibold">Coastal Dream Rentals</p>
              <p className="text-pink-600 font-bold">📞 850-974-4757</p>
            </div>
          </div>
        </div>
      </div>
      {showModal && preview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center px-4 z-50">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl w-full max-w-xl shadow-2xl p-6 animate-[fadeIn_0.3s_ease] relative overflow-y-auto max-h-[90vh]">

            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 transition p-2 rounded-full"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold mb-4 text-gray-800 tracking-wide">
              Booking Summary
            </h2>

            {/* Dates */}
            <div className="bg-gray-100 p-4 rounded-xl flex items-center justify-between mb-5">
              <div>
                <p className="text-sm text-gray-500">Check-in</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(formData.checkIn)}
                </p>
              </div>

              <div className="text-3xl font-extralight text-gray-400">→</div>

              <div>
                <p className="text-sm text-gray-500">Check-out</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(formData.checkOut)}
                </p>
              </div>
            </div>

            {/* Prices */}
            <div className="space-y-3 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl shadow-inner">
              <div className="flex justify-between text-gray-700">
                <span>Rental Rate</span>
                <b>${preview.subtotal}</b>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Cleaning + Service Fee</span>
                <b>${preview.cleaningFee + preview.serviceFee}</b>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Taxes</span>
                <b>${preview.taxes}</b>
              </div>

              {preview.discount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Discount</span>
                  <b>- ${preview.discount}</b>
                </div>
              )}

              <hr />

              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>${preview.total}</span>
              </div>
            </div>

          

            {/* Book Button */}
            <Link
              to={`/BookingPage?propertyId=${propertyId}&checkIn=${formatDate(formData.checkIn)}&checkOut=${formatDate(formData.checkOut)}`}
            >
              <button className="bg-blue-600 text-white w-full py-3 mt-6 rounded-xl">
                Review and Book
              </button>
            </Link>

          </div>
        </div>
      )}
    </>
  );
};

export default JadeEastFront;
