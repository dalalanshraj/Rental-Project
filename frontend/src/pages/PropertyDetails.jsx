import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import PropertyGallery from "../components/PropertyGallery";
import ReviewModal from "../components/ReviewModal";
import BookingPreviewModal from "../components/BookingModal";
import ProCalendar from "../components/ProCalendar.jsx";

import { MdFamilyRestroom, MdOutlineDoorBack } from "react-icons/md";
import { LuBath } from "react-icons/lu";
import { IoHome } from "react-icons/io5";

import { amenitiesData } from "../amenitiesData.js";
import { activitiesData } from "../activitiesData.js";
import InquiryModal from "../components/InquiryModal.jsx";

const PropertyDetail = () => {
  const { id } = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openReview, setOpenReview] = useState(false);
  const [openBooking, setOpenBooking] = useState(false);

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const [blockedDates, setBlockedDates] = useState([]);
  const [openInquiry, setOpenInquiry] = useState(false);
  const [calendarData, setCalendarData] = useState([]);

  // ================= FETCH LISTING =================
  useEffect(() => {
    api
      .get(`/listings/${id}`)
      .then((res) => {
        setListing(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // ================= FETCH CALENDAR =================
  useEffect(() => {
  api
    .get(`/listings/${id}/calendar`)
    .then((res) => {
      const calendar = Array.isArray(res.data) ? res.data : [];

      setCalendarData(calendar);

      const blocked = calendar
        .filter((d) => d.status === "R")
        .map((d) => new Date(d.date));

      setBlockedDates(blocked);

      console.log("PROPERTY DETAIL CALENDAR:", calendar);
    })
    .catch((err) => {
      console.log("Server error", err);
      setCalendarData([]);
      setBlockedDates([]);
    });
}, [id]);

  if (loading) return <p className="p-10">Loading...</p>;
  if (!listing) return <p className="p-10">Property not found</p>;

  // ================= IMAGES =================
  const imageUrls =
    listing.photos?.map((img) => `${import.meta.env.VITE_API_URL}${img}`) || [];

  // ================= REVIEWS =================
  const publishedReviews =
    listing.reviews?.filter((r) => r.published === true) || [];

  // ================= YOUTUBE =================
  const getYoutubeEmbed = (url) => {
    if (!url) return null;
    if (url.includes("embed")) return url;
    if (url.includes("watch?v="))
      return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/"))
      return `https://www.youtube.com/embed/${url.split("youtu.be/")[1]}`;
    return null;
  };

  // ================= MAP =================
  const getMapEmbedUrl = (lat, lng) =>
    `https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`;

  const formatDate = (date) => {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

  return (
    <>
      {/* GALLERY */}
      <PropertyGallery images={imageUrls} />

      <div className="max-w-7xl mx-auto px-4 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">

        {/* LEFT */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">

          <p className="text-gray-500 text-sm mb-2">
            {listing.location?.address || "Location"}
          </p>

          <h1 className="text-4xl font-bold mb-4">
            {listing.property?.title}
          </h1>

          {/* ICONS */}
          <div className="flex gap-20 mb-6 flex-wrap">
            <div className="text-center">
              <MdFamilyRestroom className="text-3xl mx-auto" />
              <p>Sleeps {listing.property?.maxSleeps}</p>
            </div>

            <div className="text-center">
              <MdOutlineDoorBack className="text-3xl mx-auto" />
              <p>Bedrooms {listing.property?.bedrooms}</p>
            </div>

            <div className="text-center">
              <LuBath className="text-3xl mx-auto" />
              <p>Bathrooms {listing.property?.bathrooms}</p>
            </div>

            <div className="text-center">
              <IoHome className="text-3xl mx-auto" />
              <p>{listing.property?.type}</p>
            </div>
          </div>

          {/* DESCRIPTION */}
          <h2 className="text-2xl font-semibold mb-2">Description</h2>
          <div
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: listing.description }}
          />

          {/* AMENITIES */}
          <h2 className="text-2xl font-semibold mt-8 mb-4">Amenities</h2>
          {amenitiesData.map((section) => {
            const selected = section.options.filter(
              (item) => listing.amenities?.[item]
            );
            if (selected.length === 0) return null;

            return (
              <div key={section.title} className="mb-6">
                <h5 className="bg-[#185089] text-white p-2 rounded-xl text-lg mb-2">
                  {section.title}
                </h5>

                <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 list-disc ml-6">
                  {selected.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          })}
           {/* Activities */}
          <h2 className="text-2xl font-semibold mt-8 mb-4">Activities</h2>
          {activitiesData.map((section) => {
            const selected = section.options.filter(
              (item) => listing.activities?.[item]
            );
            if (selected.length === 0) return null;

            return (
              <div key={section.title} className="mb-6">
                <h5 className="bg-[#185089] text-white p-2 rounded-xl text-lg mb-2">
                  {section.title}
                </h5>

                <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 list-disc ml-6">
                  {selected.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          })}

          {/* VIDEO */}
          {listing.video?.youtube && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-4">Property Video</h2>
              <iframe
                src={getYoutubeEmbed(listing.video.youtube)}
                className="w-full h-80 rounded-xl border"
                allowFullScreen
                title="video"
              />
            </div>
          )}

          {/* MAP */}
          {listing.location?.lat && listing.location?.lng && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-4">Location</h2>
              <iframe
                src={getMapEmbedUrl(
                  listing.location.lat,
                  listing.location.lng
                )}
                className="w-full h-96 rounded-xl border"
                allowFullScreen
                title="map"
              />
            </div>
          )}

          {/* CALENDAR */}
         <ProCalendar calendar={calendarData} />  

          {/* REVIEWS */}
          {publishedReviews.length > 0 && (
            <div className="mt-14">
              <h2 className="text-2xl font-semibold mb-6">
                Guest Reviews ({publishedReviews.length})
              </h2>

              {publishedReviews.map((review) => (
                <div key={review._id} className="mb-8">
                  <div className="border rounded-xl p-6 bg-gray-50">
                    <div className="text-yellow-500 text-lg mb-2">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>

                    <h4 className="font-semibold text-lg">
                      {review.title}
                    </h4>

                    <p className="text-gray-700 mt-2">
                      {review.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setOpenReview(true)}
            className="mt-6 bg-[#185089] text-white px-6 py-2 rounded"
          >
            Write a Review
          </button>

          {openReview && (
            <ReviewModal
              listingId={id}
              onClose={() => setOpenReview(false)}
            />
          )}
        </div>

        {/* RIGHT BOOKING */}
        <div className="sticky top-[100px] self-start bg-white rounded-2xl shadow p-6 space-y-4">
          <h3 className="text-xl font-bold">Check Availability</h3>

          <div className="flex gap-2">
            <DatePicker
              selected={checkIn}
              onChange={(date) => {
                setCheckIn(date);
                setCheckOut(null);
              }}
              excludeDates={blockedDates}
              placeholderText="Check-in"
              minDate={new Date()}
              className="border p-3 rounded w-full"
            />

            <DatePicker
              selected={checkOut}
              onChange={(date) => setCheckOut(date)}
              excludeDates={blockedDates}
              placeholderText="Check-out"
              minDate={checkIn || new Date()}
              className="border p-3 rounded w-full"
            />
          </div>

          <button
            disabled={!checkIn || !checkOut}
            onClick={() => setOpenBooking(true)}
            className={`w-full py-3 rounded-xl font-semibold text-white
      ${!checkIn || !checkOut
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            Book Now
          </button>
          <button
            onClick={() => setOpenInquiry(true)}
            className="w-full py-3 rounded-xl font-semibold bg-green-600 hover:bg-green-700 text-white"
          >
            Send Inquiry
          </button>
          {openInquiry && (
  <InquiryModal
    propertyId={id}
    onClose={() => setOpenInquiry(false)}
  />
  
)}
        </div>

      </div>

      {/* BOOKING MODAL */}
      {openBooking && (
  <BookingPreviewModal
    propertyId={id}
    checkIn={formatDate(checkIn)}
    checkOut={formatDate(checkOut)}
    onClose={() => setOpenBooking(false)}
  />
)}
    </>
  );
};

export default PropertyDetail;
