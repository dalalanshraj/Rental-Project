import { Link } from "react-router-dom";


export default function   ListingCard({
  listing,
  onToggleStatus,
  onDelete,
}) {
  // 🛑 SAFETY GUARD (MOST IMPORTANT)
  if (!listing) return null;

  const image =
  listing?.photos && listing.photos.length > 0
    ? `${import.meta.env.VITE_API_URL}${listing.photos[0]}`
    : "https://via.placeholder.com/400x300?text=No+Image";
    
  const price =
    listing?.rates && listing.rates.length > 0
      ? `₹${listing.rates[0].nightly}/night`
      : "Call for price";

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col">

      {/* IMAGE */}
      <div className="relative">
        <img
          src={image}
          alt={listing?.property?.title || "Listing image"}
          className="h-48 w-full object-cover"
        />

        {/* PRICE */}
        <span className="absolute top-3 right-3 bg-black/80 text-white text-sm px-3 py-1 rounded-full">
          {price}
        </span>

        {/* STATUS */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 text-xs rounded-full text-white
            ${listing.status === "published"
              ? "bg-green-600"
              : "bg-gray-600"}
          `}
        >
          {listing.status}
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-4 flex-1">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {listing?.property?.title || "Untitled"}
        </h3>

        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {listing?.location?.address || "No address"}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="grid grid-cols-1 gap-2 p-4 pt-0">

        <Link
          to={`/admin/listings/${listing._id}`}
          className="text-center py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 cursor-pointer"
        >
          Edit
        </Link>

        {/* <button
          onClick={() => onDelete(listing._id)}
          className="bg-red-600 py-2 rounded-lg text-white text-sm hover:bg-red-700"
        >
          Delete
        </button> */}

        <Link
          to={`/admin/listings/${listing._id}?tab=Reviews`}
          className="col-span-2 text-center py-2 rounded-lg bg-orange-500 text-white text-sm hover:bg-orange-600"
        >
          Reviews
        </Link>

        <button
          onClick={() => onToggleStatus(listing._id)}
          className={`col-span-2 py-2 rounded-lg text-white text-sm cursor-pointer
            ${listing.status === "published"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"}
          `}
        >
          {listing.status === "published" ? "Unpublish" : "Publish"}
        </button>
      </div>
    </div>
  );
}
