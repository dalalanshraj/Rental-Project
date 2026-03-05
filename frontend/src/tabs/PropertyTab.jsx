import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useModal } from "../context/ModalContext";

export default function PropertyTab({
  listingId,
  setListingId,
  initialData,
  goNextTab,
}) {

  const { showModal } = useModal();

  const [form, setForm] = useState({
    title: "",
    category: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    maxSleeps: "",
    altEmail: "",
    altPhone: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        category: initialData.category || "",
        type: initialData.type || "",
        bedrooms: initialData.bedrooms || "",
        bathrooms: initialData.bathrooms || "",
        maxSleeps: initialData.maxSleeps || "",
        altEmail: initialData.altEmail || "",
        altPhone: initialData.altPhone || "",
      });
    }
  }, [initialData]);

  const saveProperty = async () => {

    // ✅ Validation
    if (
      !form.title ||
      !form.category ||
      !form.type ||
      !form.bedrooms ||
      !form.bathrooms ||
      !form.maxSleeps
    ) {
      showModal("Please fill all required fields");
      return;
    }

    try {
      if (!listingId) {
        const res = await api.post(
          "/listings",
          form
        );
        setListingId(res.data._id);
        goNextTab();
        return;
      }

      await api.put(
        `/listings/${listingId}/property`,
        form
      );

      showModal("Property updated successfully");

    } catch (err) {
      showModal("Save failed");
    }
  };

  return (
   <div className="space-y-8">

      {/* PROPERTY NAME */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Property Name
        </label>
        <input
          maxLength={44}
          className="w-full rounded-lg border border-gray-300 px-4 py-2
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter property name"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <p className="text-xs text-gray-400 mt-1">
          Max 44 characters
        </p>
      </div>

      {/* CATEGORY & TYPE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Category
          </label>
          <select
            className="w-full rounded-lg border border-gray-300 px-4 py-2
                       focus:ring-2 focus:ring-blue-500"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Category</option>
            <option>Condo</option>
            <option>Home</option>
            <option>Townhouse</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Property Type
          </label>
          <select
            className="w-full rounded-lg border border-gray-300 px-4 py-2
                       focus:ring-2 focus:ring-blue-500"
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
          >
            <option value="">Select Type</option>
            <option>House</option>
            <option>Apartment</option>
          </select>
        </div>
      </div>

      {/* ROOMS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          ["bedrooms", "Bedrooms"],
          ["bathrooms", "Bathrooms"],
          ["maxSleeps", "Sleeps"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {label}
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 px-4 py-2
                         focus:ring-2 focus:ring-blue-500"
              value={form[key]}
              onChange={e =>
                setForm({ ...form, [key]: Number(e.target.value) })
              }
            >
              <option value="">Select</option>
              {[...Array(30)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* CONTACT INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Alternate Email
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 px-4 py-2
                       focus:ring-2 focus:ring-blue-500"
            placeholder="email@example.com"
            value={form.altEmail}
            onChange={e => setForm({ ...form, altEmail: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Alternate Phone
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 px-4 py-2
                       focus:ring-2 focus:ring-blue-500"
            placeholder="+91 98765 43210"
            value={form.altPhone}
            onChange={e => setForm({ ...form, altPhone: e.target.value })}
          />
        </div>
      </div>

      {/* ACTION */}
      <div className="flex justify-end pt-4">
        <button
          onClick={saveProperty}
          className="bg-blue-600 hover:bg-blue-700 text-white
                     px-8 py-2 rounded-lg font-semibold transition cursor-pointer"
        >
          {listingId ? "Update & Continue" : "Save & Continue"}
        </button>
      </div>

    </div>

  );
}