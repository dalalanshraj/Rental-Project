import { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";

const mapContainerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 30.3831, lng: -86.4974 };

const PropertyMap = ({ properties, selectedProperty }) => {
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const [selected, setSelected] = useState(null);
  const mapRef = useRef(null);

  const onMapLoad = (map) => {
    mapRef.current = map;

    // 🟢 FIT MAP TO ALL MARKERS
    if (properties.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();

      properties.forEach((p) => {
        if (p.location?.lat && p.location?.lng) {
          bounds.extend({
            lat: p.location.lat,
            lng: p.location.lng,
          });
        }
      });

      map.fitBounds(bounds);
    }
  };

  // 🟢 Focus when clicking list item
  useEffect(() => {
    if (
      selectedProperty &&
      selectedProperty.location?.lat &&
      selectedProperty.location?.lng &&
      mapRef.current
    ) {
      mapRef.current.panTo({
        lat: selectedProperty.location.lat,
        lng: selectedProperty.location.lng,
      });
      mapRef.current.setZoom(14);
      setSelected(selectedProperty);
    }
  }, [selectedProperty]);

  if (!isLoaded) return <div>Loading Map…</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      onLoad={onMapLoad}
      center={defaultCenter}
      zoom={10}
    >
      {/* 🟢 MULTIPLE MARKERS */}
      {properties.map((property) => {
        if (!property.location?.lat || !property.location?.lng) return null;

        return (
          <Marker
            key={property._id}
            position={{
              lat: property.location.lat,
              lng: property.location.lng,
            }}
            onClick={() => setSelected(property)}
            icon={
              selected?._id === property._id
                ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }
          />
        );
      })}

      {/* 🟢 INFO WINDOW */}

      {selected && selected.location && (

        <InfoWindow
          position={{
            lat: selected.location.lat,
            lng: selected.location.lng,
          }}
          onCloseClick={() => setSelected(null)}
        >

          <div className="w-48">

            <img
              src={
                selected?.photos?.[0]
                  ? `${import.meta.env.VITE_API_URL}${selected.photos[0].replace(/^\/api/, "")}`
                  : "https://via.placeholder.com/200x120"
              }
              alt={selected?.property?.title}
              className="w-full h-24 object-cover rounded mb-2"
            />
            <h3 className="font-semibold text-sm">
              {selected.property?.title}
            </h3>
            <p className="text-xs text-gray-600">
              {selected.location.address}
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default PropertyMap;
