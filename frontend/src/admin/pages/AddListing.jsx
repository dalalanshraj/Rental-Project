import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
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
import Reviews from "../../tabs/Reviews.jsx"
import CalendarTab from "../../tabs/CalendarTab.jsx";
import DealsTab from "../../tabs/DealsTab.jsx";


const tabs = [
  "Property",
  "Description",
  "Amenities",
  "Activities",
  "Photos",
  "Video",
  "Rates",
  "Location",
  "Calendar",
  "Reviews",
  "Deals",
  "Inquiry",
];
export default function AddListing() {
  const [listingId, setListingId] = useState(null);
   const [listing, setListing] = useState(null);
  const [activeTab, setActiveTab] = useState("Property");
  const [listingData, setListingData] = useState(null);

  const { id } = useParams();
  const [searchParams] = useSearchParams();
  


  useEffect(() => {
    if (id) {
      setListingId(id);
    }
    const tabFromUrl = searchParams.get("tab");

    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [id, searchParams]);

useEffect(() => {
  const tab = searchParams.get("tab");
  if (tab) setActiveTab(tab);
}, [searchParams]);


  useEffect(() => {
    if (!listingId) return;

    api
      .get(`/listings/${listingId}`)
      .then(res => {
        setListingData(res.data);
        
      });
  }, [listingId]);

  // !Switch Tabs after fill 
  const goNextTab = () => {
    const index = tabs.indexOf(activeTab);
    if (index < tabs.length - 1) {
      setActiveTab(tabs[index + 1]);
    }
  };

  return (
    <>
      <div className="flex">



        {/* <Sidebar /> */}
        <div className=" max-w-7xl ">

          <h1 className="text-3xl font-bold mb-6 text-gray-800 ">
            {listingId ? "Edit Listing" : "Add Listing"}
             <span className="text-yellow-600 mx-5">
   {listingData?.property?.title }
  </span>
          </h1>

          {/* tabs */}
          <div className="flex gap-2 border-b mb-6 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-3 text-sm font-semibold whitespace-nowrap transition
    ${activeTab === tab
                    ? "text-blue-600 after:absolute after:left-0 after:bottom-0 after:h-[3px] after:w-full after:bg-blue-600"
                    : "text-gray-500 hover:text-blue-500"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 min-h-[300px]">


            {activeTab === "Property" && (
              <PropertyTab listingId={listingId}
                setListingId={setListingId}
                initialData={listingData?.property}
                goNextTab={goNextTab} />)}

            {activeTab === "Description" && (
              <DescriptionTab
                listingId={listingId}
                initialData={listingData?.description || ""}
                goNextTab={goNextTab}
              />
            )}

            {activeTab === "Amenities" && (
              <AmenitiesTab listingId={listingId}
                setListingId={setListingId}
                initialData={listingData?.Amenities}
                goNextTab={goNextTab} />)}

            {activeTab === "Activities" && (
              <ActivitiesTab listingId={listingId}
                setListingId={setListingId}
                initialData={listingData?.Activities}
                goNextTab={goNextTab} />)}

            {activeTab === "Photos" && (
              <PhotosTab listingId={listingId}
                setListingId={setListingId}
                initialData={listingData?.Photos}
                goNextTab={goNextTab} />)}

            {activeTab === "Video" && (
              <VideoTab listingId={listingId}
                setListingId={setListingId}
                initialData={listingData?.Video}
                goNextTab={goNextTab} />)}

            {activeTab === "Rates" && (
              <RatesTab listingId={listingId}
                setListingId={setListingId}
                initialData={listingData?.Rates}
                goNextTab={goNextTab} />)}

            {activeTab === "Location" && (
              <LocationTab listingId={listingId}
                setListingId={setListingId}
                initialData={listingData?.Location}
                goNextTab={goNextTab} />)}

            {activeTab === "Reviews" && (
              <Reviews listingId={listingId}
                setListingId={setListingId}
                initialData={listingData?.Reviews}
                goNextTab={goNextTab} />)}

            {activeTab === "Deals" && (
              <DealsTab
                listingId={listingId}
                setListingId={setListingId}
                initialData={listingData?.Deals}
                goNextTab={goNextTab}

              />
            )}

            {activeTab === "Inquiry" && (
              <Inquiry listingId={listingId}
                setListingId={setListingId}
                initialData={listingData?.Inquiry}
                goNextTab={goNextTab} 
                 setActiveTab={setActiveTab}/>)}
            {activeTab === "Calendar" && (
              <CalendarTab
                listingId={listingId}
                calendar={listingData?.calendar}
              />

            )}

          </div>
        </div>
      </div>
    </>
  );
}
