import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function VideoTab({ listingId, goNextTab }) {
  const [form, setForm] = useState({
    youtube: "",
    virtualTour: "",
  });

  const [loading, setLoading] = useState(false);

  // LOAD SAVED VIDEO (EDIT MODE)
  useEffect(() => {
    if (!listingId) return;

    api
      .get(`/listings/${listingId}`)
      .then((res) => {
        if (res.data?.video) {
          setForm({
            youtube: res.data.video.youtube || "",
            virtualTour: res.data.video.virtualTour || "",
          });
        }
      })
      .catch(() => {});
  }, [listingId]);

  // YOUTUBE EMBED FIX
  const getEmbedUrl = (url) => {
    if (!url) return "";

    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }

    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${id}`;
    }

    if (url.includes("embed")) {
      return url;
    }

    return "";
  };

  // SAVE VIDEO
  const saveVideo = async () => {
    if (!listingId) {
     
      return;
    }

    try {
      setLoading(true);

      await api.put(
        `/listings/${listingId}/video`,
        form
      );

      
      goNextTab();
      return
    } catch {
      return
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Videos & Virtual Tour
        </h2>
        <p className="text-sm text-gray-500">
          Add a YouTube video or a virtual tour to showcase the property.
        </p>
      </div>

      {/* VIDEO FORM */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">

        {/* YOUTUBE */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            YouTube Video URL
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 px-4 py-2
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://www.youtube.com/watch?v=xxxx"
            value={form.youtube}
            onChange={(e) =>
              setForm({ ...form, youtube: e.target.value })
            }
          />
          <p className="text-xs text-gray-400 mt-1">
            Paste a YouTube watch or share link
          </p>
        </div>

        {/* VIRTUAL TOUR */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Virtual Tour URL
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 px-4 py-2
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://my.matterport.com/..."
            value={form.virtualTour}
            onChange={(e) =>
              setForm({ ...form, virtualTour: e.target.value })
            }
          />
          <p className="text-xs text-gray-400 mt-1">
            Optional (Matterport, 3D tour, etc.)
          </p>
        </div>
      </div>

      {/* PREVIEW */}
      {form.youtube && (
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Video Preview
          </p>
          <iframe
            className="w-full h-72 rounded-lg"
            src={getEmbedUrl(form.youtube)}
            allowFullScreen
            title="Video preview"
          />
        </div>
      )}

      {/* ACTION */}
      <div className="flex justify-end pt-4 border-t">
        <button
          onClick={saveVideo}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                     text-white px-8 py-2 rounded-lg font-semibold transition cursor-pointer"
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </div>

    </div>
  );
}
