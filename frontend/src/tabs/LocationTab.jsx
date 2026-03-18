import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import api from "../api/axios.js";
import {  useModal }  from "../context/ModalContext";

const containerStyle = {
  width: "100%",
  height: "450px",
};

export default function LocationTab({ listingId, goNextTab }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [position, setPosition] = useState({
    lat: 30.2447,
    lng: -87.7056,
  });

  const [address, setAddress] = useState("");
   const { showModal } = useModal();

  // ===============================
  // LOAD SAVED LOCATION (EDIT MODE)
  // ===============================
  useEffect(() => {
    if (!listingId) return;

    api
      .get(`/listings/${listingId}`)
      .then((res) => {
        if (res.data?.location?.lat && res.data?.location?.lng) {
          setPosition({
            lat: Number(res.data.location.lat),
            lng: Number(res.data.location.lng),
          });
          setAddress(res.data.location.address || "");
        }
      });
  }, [listingId]);

  // ===============================
  // SAVE LOCATION (LAT/LNG)
  // ===============================
  const saveLocation = async (lat, lng) => {
    setPosition({ lat, lng });

    await api.put(
      `/listings/${listingId}/location`,
      {
        lat,
        lng,
        address,
      }
    );
  };

  // ===============================
  // ADDRESS → LAT/LNG (GEOCODING)
  // ===============================
  const locateByAddress = () => {
    if (!address) {
      showModal("Please enter address");
      return;
    }

    const geocoder = new window.google.maps.Geocoder();

   geocoder.geocode({ address }, (results, status) => {
  // console.log("Geocode status:", status);
  // console.log("Results:", results);

  if (status === "OK" && results.length > 0) {
    const loc = results[0].geometry.location;
    const lat = loc.lat();
    const lng = loc.lng();

    saveLocation(lat, lng);
    goNextTab();
  } else {
    showModal("Address not found. Try full address with city, state & country.");
  }
});

  };

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold">Property Location</h2>
        <p className="text-sm text-gray-500">
          Set location using address, map or coordinates
        </p>
      </div>

      {/* ADDRESS INPUT */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Property Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter full address (city, state, country)"
          className="border p-2 w-full rounded"
        />
      </div>

      {/* BUTTON */}
      <button
        onClick={locateByAddress}
        className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
      >
        Locate by Address
      </button>

      {/* MAP */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={10}
        mapTypeId="roadmap"
      >
        <Marker
          position={position}
          draggable
          onDragEnd={(e) =>
            saveLocation(
              e.latLng.lat(),
              e.latLng.lng()
            )
          }
        />
      </GoogleMap>

      {/* LAT / LNG INPUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold">Latitude</label>
          <input
            className="border p-2 w-full rounded"
            value={position.lat}
            onChange={(e) =>
              setPosition({ ...position, lat: Number(e.target.value) })
            }
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Longitude</label>
          <input
            className="border p-2 w-full rounded"
            value={position.lng}
            onChange={(e) =>
              setPosition({ ...position, lng: Number(e.target.value) })
            }
          />
        </div>
      </div>

      {/* SAVE */}
      <div className="flex justify-end pt-4">
        <button
          onClick={async () => {
            await saveLocation(position.lat, position.lng);
            goNextTab();
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer"
        >
          Save & Continue
        </button>
      </div>

    </div>
  );
}
