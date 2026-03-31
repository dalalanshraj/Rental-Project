import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function CommunityDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/listings/${id}`);
        setProperty(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProperty();
  }, [id]);

  const getYoutubeEmbed = (url) => {
    if (!url) return null;
    if (url.includes("embed")) return url;
    if (url.includes("watch?v="))
      return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/"))
      return `https://www.youtube.com/embed/${url.split("youtu.be/")[1]}`;
    return null;
  };

  if (!property) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <>
    {/* HERO */}
      <section
        className="relative h-[70vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "url(https://www.coastaldreamrentals.com/img/hero-bg-img.jpeg)",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div >

        <h1 className="relative text-6xl font-extrabold">
         COMMUNITIES
        </h1>
      </section>
    
  <div className="bg-gray-100 min-h-screen  px-40 lg:px-16 pb-3">

    {/* MAIN CONTAINER */}
    <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

      {/* TOP ADDRESS BAR */}
      <div className= " bg-[#5bb5b0] text-white px-30 py-3 text-sm font-medium">
        📍 {property.location?.address || "Location not available"}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">

        {/* LEFT - IMAGE */}
        <div className="w-full">
          <img
            src={property.photos?.[0]}
            alt={property.property?.title}
            className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover rounded-xl shadow-md"
          />
        </div>

        {/* RIGHT - DETAILS */}
        <div className="flex flex-col justify-center">

          {/* TITLE */}
          <h1 className="text-3xl md:text-4xl font-semibold text-[#355e73] mb-4">
            {property.property?.title}
          </h1>

          {/* INFO */}
          <div className="flex gap-6 text-gray-600 mb-6 text-lg">
            <span>🛏 {property.property?.bedrooms}</span>
            <span>🛁 {property.property?.bathrooms}</span>
          </div>

          {/* DESCRIPTION */}
          <div className="text-gray-600 leading-relaxed space-y-3 max-h-[300px] overflow-y-auto pr-2">
            <div
              dangerouslySetInnerHTML={{ __html: property.description }}
            />
          </div>

        </div>
      </div>
    </div>

    {/* VIDEO SECTION */}
    {property.video?.youtube && (
      <div className="max-w-7xl mx-auto mt-10">
        <div className="relative w-full pb-[24.25%] h-0 overflow-hidden rounded-xl shadow-lg">
          <iframe
                src={getYoutubeEmbed(property.video.youtube)}
                className="w-full h-80 rounded-xl border"
                allowFullScreen
                title="video"
              />
        </div>
      </div>
    )}
  </div>
  </>
);
}