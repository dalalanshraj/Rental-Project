import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import PropertyCard from "../components/PropertyCard";

const Properties = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/listings/published")
      .then((res) => {
        setListings(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
        <div className="absolute inset-0 bg-black/50"></div>
        <h1 className="relative text-6xl font-extrabold">
          Properties
        </h1>
      </section>

      {/* LISTINGS */}
      <div className="p-10 bg-gray-100 min-h-screen">
        <h2 className="text-3xl font-bold text-center mb-8">
          Available Properties
        </h2>

        {loading && (
          <p className="text-center text-gray-500">
            Loading properties...
          </p>
        )}

        {!loading && listings.length === 0 && (
          <p className="text-center text-red-500">
            No properties available
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {listings.map((listing) => (
            <PropertyCard
              key={listing._id}
              listing={listing}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Properties;
