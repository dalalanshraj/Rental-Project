import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useModal } from "../context/ModalContext";

export default function PhotosTab({ listingId, goNextTab }) {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { showModal } = useModal();

  // ===========================
  // LOAD EXISTING PHOTOS
  // ===========================
  useEffect(() => {
    if (!listingId) return;

    api
      .get(`/listings/${listingId}`)
      .then((res) => {
        setPhotos(res.data.photos || []);
      })
      .catch(() => { });
  }, [listingId]);

  // ===========================
  // UPLOAD PHOTOS
  // ===========================
  const uploadPhotos = async (files) => {
    if (!listingId) return showModal("Create listing first");

    setUploading(true);

    const formData = new FormData();

    for (let file of files) {
      formData.append("photos", file);
    }

    try {
      const res = await api.put(
        `/listings/${listingId}/photos`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPhotos(res.data.photos); // updated list
    } catch (err) {
      showModal("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ===========================
  // DELETE PHOTO
  // ===========================
  const deletePhoto = async (filename) => {
    if (!window.confirm("Delete photo?")) return;

    try {
      const res = await api.delete(
        `/listings/${listingId}/photos/${filename}`
      );
      
      setPhotos(res.data.photos);
    } catch (err) {
      // console.log(err);
      showModal("Delete failed");
    }
  };

  return (
    <div className="space-y-6">

      {/* Upload */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => uploadPhotos(e.target.files)}
        className="border p-2"
      />

      {uploading && (
        <p className="text-blue-600 font-semibold">Uploading...</p>
      )}

      {/* Preview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div key={photo} className="relative border rounded overflow-hidden">

            <img
              src={`${import.meta.env.VITE_API_URL}${photo}`}
              alt="listing"
              className="w-full h-32 object-cover"
            />

            <button
              onClick={() => deletePhoto(photo.split("/").pop())}
              className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
            >
              ✕
            </button>

          </div>
        ))}
      </div>

      {/* NEXT BUTTON */}
      <div className="pt-6">
        <button
          onClick={goNextTab}
          className="bg-blue-600 text-white px-6 py-2 rounded cursor-pointer"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
