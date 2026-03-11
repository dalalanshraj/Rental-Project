import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { activitiesData } from "../activitiesData.js";
import { useModal } from "../context/ModalContext";

export default function ActivitiesTab({ listingId, goNextTab, initialData = {} }) {
  const [activities, setActivities] = useState({});
  const { showModal } = useModal();

  /* ================= PRELOAD ================= */
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setActivities(initialData);
    }
  }, [initialData]);

  /* ================= LOAD ================= */
  useEffect(() => {
    if (!listingId) return;

    api
      .get(`/listings/${listingId}`)
      .then((res) => {
        setActivities(res.data.activities || {});
      })
      .catch(() => {});
  }, [listingId]);

  /* ================= HANDLERS ================= */
  const toggleCheckbox = (value) => {
    setActivities((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));
  };

  const selectRadio = (group, value) => {
    setActivities((prev) => {
      const updated = { ...prev };

      Object.keys(updated).forEach((k) => {
        if (k.startsWith(group + ":")) delete updated[k];
      });

      updated[`${group}:${value}`] = true;
      return updated;
    });
  };

  const checkAll = (options, checked) => {
    const updated = {};
    options.forEach((opt) => (updated[opt] = checked));
    setActivities((prev) => ({ ...prev, ...updated }));
  };

  /* ================= SAVE ================= */
  const saveActivities = async () => {
    await api.put(
      `/listings/${listingId}/activities`,
      activities
    );
    // alert("Activities saved");
    goNextTab();
    return
  };

  return (
    <div className="space-y-6">

      {/* ACTION BAR */}
      <div className="sticky top-0 bg-white z-10 flex justify-end border-b pb-4">
        <button
          onClick={saveActivities}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg cursor-pointer"
        >
          Save & Next →
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1 items-start">

        {activitiesData.map((section) => (
          <div
            key={section.title}
            className="bg-white rounded-xl shadow-sm border hover:shadow-md transition"
          >

            {/* HEADER */}
            <div className="px-4 py-3 border-b font-semibold text-gray-700 bg-gray-50 rounded-t-xl">
              {section.title}
            </div>

            {/* CHECK ALL */}
            {section.type === "checkbox" && (
              <label className="flex items-center gap-2 px-4 py-3 text-sm bg-blue-50">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    checkAll(section.options, e.target.checked)
                  }
                />
                Select all
              </label>
            )}

            {/* OPTIONS */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {section.options.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type={section.type}
                    name={section.name}
                    checked={
                      section.type === "radio"
                        ? !!activities[`${section.name}:${option}`]
                        : !!activities[option]
                    }
                    onChange={() =>
                      section.type === "radio"
                        ? selectRadio(section.name, option)
                        : toggleCheckbox(option)
                    }
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
