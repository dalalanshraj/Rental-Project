import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import PropertyMap from "../components/PropertyMap";
import { ArrowUpRight } from "lucide-react";

const ResultsPage = ({ listing }) => {
  const location = useLocation();

  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==============================
  // FETCH SEARCH RESULTS
  // ==============================
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const checkIn = params.get("checkIn");
    const checkOut = params.get("checkOut");

    // console.log("FRONTEND DATES:", checkIn, checkOut); // 👈 ADD

    axios.get("http://localhost:8000/api/search", {
      params: { checkIn, checkOut },
    })
      .then((res) => {
        setProperties(res.data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        // console.error("Search error:", err);
        setLoading(false);
      });
  }, [location.search]);

  return (
    <>
      {/* ================= HERO ================= */}
      <section
        className="relative h-[40vh] bg-cover bg-center flex items-center justify-center text-white text-center"
        style={{
          backgroundImage:
            "url(https://www.coastaldreamrentals.com/img/hero-bg-img.jpeg)",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <h1 className="relative z-10 text-6xl font-extrabold mt-32">
          Search Results
        </h1>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {loading && (
          <p className="text-center text-gray-500 text-lg">
            Loading available properties...
          </p>
        )}

        {!loading && properties.length === 0 && (
          <p className="text-center text-red-500 text-lg">
            No properties available for selected dates
          </p>
        )}

        {!loading && properties.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ================= MAP ================= */}
            <div className="lg:col-span-2 h-[80vh] rounded-xl overflow-hidden border">
              <PropertyMap
                properties={properties}
                selectedProperty={selectedProperty}
              />
            </div>

            {/* ================= LIST ================= */}
            <div className="h-[80vh] overflow-y-auto space-y-4">

              {properties.map((p) => (
                <div
                  key={p._id}
                  onClick={() => setSelectedProperty(p)}
                  className={`border rounded-xl p-4 cursor-pointer transition
                    ${selectedProperty?._id === p._id
                      ? "border-blue-600 bg-blue-50"
                      : "hover:bg-gray-50"
                    }`}
                >
                  {/* IMAGE */}
                  <img
                    src={`http://localhost:8000/${p.photos?.[0]}`}
                    alt={p.property?.title}
                    className="w-full h-44 object-cover rounded-lg"
                  />

                  {/* TITLE + LINK */}
                  <div className="flex justify-between items-center mt-3">
                    <h3 className="font-semibold text-lg">
                      {p.property?.title}
                    </h3>

                    <Link
                      to={`/${p._id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ArrowUpRight className="w-6 h-6 text-sky-600 hover:text-sky-800" />
                    </Link>
                  </div>

                  {/* DETAILS */}
                  <p className="text-sm text-gray-600 mt-1">
                    {p.property?.maxSleeps} guests •{" "}
                    {p.property?.bathrooms} baths
                  </p>

                  {/* PRICE (from rates) */}
                  {p.rates?.length > 0 && (
                    <p className="mt-2 font-semibold text-blue-700">
                      From ${Math.min(...p.rates.map(r => r.nightly))} / night
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ResultsPage;
