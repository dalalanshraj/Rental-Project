import React from "react";
import { Link } from "react-router-dom";

const PropertyCard = ({ listing }) => {
  if (!listing) return null;

  // IMAGE
  const image =
    listing?.photos?.length > 0
      ? `${import.meta.env.VITE_API_URL}${listing.photos[0]}`
      : "https://via.placeholder.com/400x300?text=No+Image";

  // PRICE
 const originalPrice =
  listing?.rates?.[0]?.nightly || null;

const dealPrice = listing?.deal?.discountedRate;

const price = dealPrice || originalPrice || "Call for price";

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden relative">

      {/* DEAL RIBBON */}
     {listing?.deal && (
  <div className="absolute top-0 left-0 bg-orange-500 text-white text-xs px-6 py-1 -rotate-45 -translate-x-8 translate-y-4">
    DEAL
  </div>
)}

      {/* IMAGE */}
      <img
        src={image}
        alt={listing?.property?.title || "Property"}
        className="w-full h-56 object-cover"
      />

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-1">
          {listing?.property?.title ?? "Property"}
        </h3>

        <p className="text-gray-600 text-sm mb-2">
          {listing?.property?.category ?? "Vacation Rental"}
        </p>

    <div className="text-lg font-semibold">

  {listing?.deal ? (
    <>
      <span className="text-red-500 font-bold">
        ${listing.deal.discountedRate}
      </span>

      <span className="line-through text-gray-400 ml-2 text-sm">
        ${originalPrice}
      </span>
    </>
  ) : (
    <span>
      {typeof originalPrice === "number"
        ? `$${originalPrice} / night`
        : "Call for price"}
    </span>
  )}

</div>

        <Link
          to={`/${listing?._id}`}
          className="inline-block mt-3 text-blue-600 font-semibold"
        >
          View Details →
        </Link>
      </div>

    </div>
  );
};

export default PropertyCard;