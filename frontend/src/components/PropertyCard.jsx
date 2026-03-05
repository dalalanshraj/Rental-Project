import React from "react";
import { Link } from "react-router-dom";
// import api from "../../api/axios.js";

const PropertyCard = ({ listing }) => {
  if (!listing) return null;

  const image =
  listing?.photos && listing.photos.length > 0
    ? `${import.meta.env.VITE_API_URL}${listing.photos[0]}`
    : "https://via.placeholder.com/400x300?text=No+Image";

  const price =
    listing.rates?.length > 0
      ? listing.rates[0].nightly
      : "Call for price";

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">

      {/* IMAGE */}
      <img
        src={image}
        alt={listing.property?.title}
        className="w-full h-56 object-cover"
      />

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-1">
          {listing.property?.title || "Property"}
        </h3>

        <p className="text-gray-600 text-sm mb-2">
          {listing.property?.category || "Vacation Rental"}
        </p>

        <p className="font-semibold text-lg">
          {typeof price === "number" ? `$${price} / night` : price}
        </p>

        <Link
          to={`/${listing._id}`}
          className="inline-block mt-3 text-blue-600 font-semibold"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;



