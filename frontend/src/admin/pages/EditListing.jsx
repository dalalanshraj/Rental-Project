import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios.js";

import PropertyTab from "../../tabs/PropertyTab";
import DescriptionTab from "../../tabs/DescriptionTab";
import AmenitiesTab from "../../tabs/AmenitiesTab";
import ActivitiesTab from "../../tabs/ActivitiesTab";
import PhotosTab from "../../tabs/PhotosTab";
import VideoTab from "../../tabs/VideoTab";
import RatesTab from "../../tabs/RatesTab";
import LocationTab from "../../tabs/LocationTab";
import Inquiry from "../../tabs/Inquiry";
// import Sidebar from "../components/Sidebar";

const tabs = [
  "Property",
  "Description",
  "Amenities",
  "Activities",
  "Photos",
  "Video",
  "Rates",
  "Location",
  "Inquiry",
];

export default function EditListing() {
  const { id } = useParams();

  const [listing, setListing] = useState(null);
  const [activeTab, setActiveTab] = useState("Property");

  useEffect(() => {
  if (initialData) setForm(initialData);
}, [initialData]);

  // ✅ LOAD EXISTING LISTING
  useEffect(() => {
    api
      .get(`/listings/${id}`)
      .then((res) => setListing(res.data))
      .catch(() => alert("Listing not found"));
  }, [id]);

  if (!listing) return <p className="p-6">Loading listing...</p>;

  return (
    <div className="flex">
      {/* <Sidebar /> */}

      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">
  Edit Listing -{" "}
  <span className="text-blue-600">
    {listing?.property?.title || listing?.property?.name || "Property"}
  </span>
</h1>

        {/* TABS */}
        <div className="flex gap-6 border-b mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Property" && (
          <PropertyTab
            listingId={listing._id}
            initialData={listing.property}
          />
        )}

        {activeTab === "Description" && (
          <DescriptionTab
            listingId={listing._id}
            initialData={listing.description}
          />
        )}

        {activeTab === "Amenities" && (
          <AmenitiesTab
            listingId={listing._id}
            initialData={listing.amenities}
          />
        )}

        {activeTab === "Activities" && (
          <ActivitiesTab
            listingId={listing._id}
            initialData={listing.activities}
          />
        )}

        {activeTab === "Photos" && (
          <PhotosTab
            listingId={listing._id}
            initialData={listing.photos}
          />
        )}

        {activeTab === "Video" && (
          <VideoTab
            listingId={listing._id}
            initialData={listing.video}
          />
        )}

        {activeTab === "Rates" && (
          <RatesTab listingId={listing._id} />
        )}

        {activeTab === "Location" && (
          <LocationTab
            listingId={listing._id}
            initialData={listing.location}
          />
        )}

        {activeTab === "Inquiry" && (
          <Inquiry listingId={listing._id} />
        )}
      </div>
    </div>
  );
}
