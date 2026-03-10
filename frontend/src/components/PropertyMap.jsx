import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

const defaultCenter = [30.3831, -86.4974];

// default marker fix (Leaflet icon bug)
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const PropertyMap = ({ properties, selectedProperty }) => {

  const mapRef = useRef(null);
  const [selected, setSelected] = useState(null);

  function MapController({ selectedProperty }) {
    const map = useMap();

    useEffect(() => {
      if (
        selectedProperty &&
        selectedProperty.location?.lat &&
        selectedProperty.location?.lng
      ) {
        map.flyTo(
          [
            selectedProperty.location.lat,
            selectedProperty.location.lng
          ],
          14,
          { duration: 1.5 }
        );
      }
    }, [selectedProperty]);

    return null;
  }

  // ✅ SELECTED PROPERTY FOCUS
  useEffect(() => {

    if (
      selectedProperty &&
      selectedProperty.location?.lat &&
      selectedProperty.location?.lng &&
      mapRef.current
    ) {

      mapRef.current.flyTo(
        [
          selectedProperty.location.lat,
          selectedProperty.location.lng
        ],
        14,
        { duration: 1.5 }
      );

      setSelected(selectedProperty);
    }

  }, [selectedProperty]);



  // ✅ FILTER RESULTS → FIT MAP TO ALL MARKERS
  useEffect(() => {

    if (!mapRef.current || properties.length === 0) return;

    const bounds = L.latLngBounds();

    properties.forEach((p) => {
      if (p.location?.lat && p.location?.lng) {
        bounds.extend([p.location.lat, p.location.lng]);
      }
    });

    mapRef.current.fitBounds(bounds, { padding: [50, 50] });

  }, [properties]);


  return (
    <MapContainer
      center={defaultCenter}
      zoom={10}
      whenCreated={(map) => (mapRef.current = map)}
      style={{ width: "100%", height: "100%" }}
    >

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController selectedProperty={selectedProperty} />

      {/* Multiple markers */}
      {properties.map((property) => {

        if (!property.location?.lat || !property.location?.lng) return null;

        return (
          <Marker
            key={property._id}
            icon={markerIcon}
            position={[
              property.location.lat,
              property.location.lng
            ]}
            eventHandlers={{
              click: () => setSelected(property)
            }}
          />
        );

      })}
      {/* Popup */}
      {selected && selected.location && (
        <Popup
          position={[
            selected.location.lat,
            selected.location.lng
          ]}
        >
          <div className="w-48">
            <img
              src={
                selected.photos?.[0]
                  ? `${import.meta.env.VITE_API_URL}/${selected.photos[0]}`
                  : "https://via.placeholder.com/200x120"
              }
              alt={selected.property?.title}
              className="w-full h-24 object-cover rounded mb-2"
            />
            <h3 className="font-semibold text-sm">
              {selected.property?.title}
            </h3>
            <p className="text-xs text-gray-600">
              {selected.location.address}
            </p>
          </div>
        </Popup>
      )}
    </MapContainer>
  );
};

export default PropertyMap;