  import { useEffect, useState } from "react";
  import axios from "axios";

  export default function PhotosTab({ listingId, goNextTab }) {
    const [photos, setPhotos] = useState([]);
    const [uploading, setUploading] = useState(false);

    // ===========================
    // LOAD EXISTING PHOTOS
    // ===========================
    useEffect(() => {
      if (!listingId) return;

      axios
        .get(`http://localhost:8000/api/listings/${listingId}`)
        .then((res) => {
          setPhotos(res.data.photos || []);
        })
        .catch(() => {});
    }, [listingId]);

    // ===========================
    // UPLOAD PHOTOS
    // ===========================
    const uploadPhotos = async (files) => {
      if (!listingId) return alert("Create listing first");

      setUploading(true);

      const formData = new FormData();

      for (let file of files) {
        formData.append("photos", file);
      }

      try {
        const res = await axios.put(
    `http://localhost:8000/api/listings/${listingId}/photos`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",},
          }
        );

        setPhotos(res.data.photos); // updated list
      } catch (err) {
        alert("Upload failed");
      } finally {
        setUploading(false);
      }
    };

    // ===========================
    // DELETE PHOTO
    // ===========================
    const deletePhoto = async (photoId) => {
      if (!window.confirm("Delete photo?")) return;

      try {
        const res = await axios.delete(
          `http://localhost:8000/api/listings/${listingId}/photos/${photoId}`
        );

        setPhotos(res.data.photos);
      } catch {
        alert("Delete failed");
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
            <div key={photo} className="relative border rounded">
      <img src={photo} className="h-32 w-full object-cover" />

              <button
                onClick={() => deletePhoto(photo._id)}
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
