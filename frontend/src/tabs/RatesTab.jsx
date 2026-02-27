import { useEffect, useState } from "react";
import axios from "axios";
import { useModal } from "../context/ModalContext";

/* ===============================
   EMPTY STRUCTURES
================================ */
const emptyRate = {
  season: "",
  from: "",
  to: "",
  nightly: "",
  weekly: "",
  monthly: "",
  minNights: ""
};


const emptyFee = {
  name: "",
  value: "",
  type: "$",
  option: "mandatory"
};

export default function RatesTab({ listingId, goNextTab }) {
  const [rates, setRates] = useState([]);
  const [extraFees, setExtraFees] = useState([]);

  const [form, setForm] = useState(emptyRate);
  const [feeForm, setFeeForm] = useState(emptyFee);

  const [showFeeModal, setShowFeeModal] = useState(false);
  const [editFeeIndex, setEditFeeIndex] = useState(null);
  const { showModal } = useModal();

  /* ===============================
     LOAD LISTING DATA
  ================================ */
  useEffect(() => {
    if (!listingId) return;

    axios
      .get(`http://localhost:8000/api/listings/${listingId}`)
      .then(res => {
        setRates(res.data?.rates || []);
        setExtraFees(res.data?.extraFees || []);
      })
      .catch(err => console.log(err));
  }, [listingId]);

  /* ===============================
     ADD RATE
  ================================ */
  const addRate = async () => {
    if (!form.season || !form.nightly) {
      showModal("Season & nightly price required");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:8000/api/listings/${listingId}/rates`,
        { rate: form }
      );

      setRates(res.data.rates);
      setForm(emptyRate);
      goNextTab && goNextTab();
    } catch {
      showModal("Failed to add rate");
    }
  };

  /* ===============================
     DELETE RATE
  ================================ */
  const deleteRate = async (index) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/listings/${listingId}/rates/delete`,
        { index }
      );
      setRates(res.data.rates);
    } catch {
      showModal("Delete failed");
    }
  };

  /* ===============================
     SAVE EXTRA FEE
  ================================ */
  const saveExtraFee = async () => {
    try {
      const url =
        editFeeIndex !== null
          ? "/extra-fees/edit"
          : "/extra-fees";

      const payload =
        editFeeIndex !== null
          ? { index: editFeeIndex, fee: feeForm }
          : feeForm;

      const res = await axios.put(
        `http://localhost:8000/api/listings/${listingId}${url}`,
        payload
      );

      setExtraFees(res.data);
      setFeeForm(emptyFee);
      setEditFeeIndex(null);
      setShowFeeModal(false);
    } catch {
      alert("Fee save failed");
    }
  };

  /* ===============================
     DELETE EXTRA FEE
  ================================ */
  const deleteExtraFee = async (index) => {
    const res = await axios.put(
      `http://localhost:8000/api/listings/${listingId}/extra-fees/delete`,
      { index }
    );
    setExtraFees(res.data);
  };

  /* ===============================
     SUMMARY
  ================================ */
  const nightlyRates = rates.map(r => Number(r.nightly)).filter(Boolean);

  const minNightly = nightlyRates.length ? Math.min(...nightlyRates) : 0;
  const maxNightly = nightlyRates.length ? Math.max(...nightlyRates) : 0;
  const avgNightly = nightlyRates.length
    ? (nightlyRates.reduce((a, b) => a + b, 0) / nightlyRates.length).toFixed(2)
    : 0;

  const minNightsOverall =
    rates.length > 0
      ? Math.min(...rates.map(r => Number(r.minNights || 0)))
      : 0;

  return (
    <div className="bg-[#f1fbf7] p-6 rounded-xl space-y-10">

      {/* ================= RENTAL RATES ================= */}
      <div>
        <h2 className="text-blue-700 text-2xl font-semibold mb-4">
          Rental Rates
        </h2>

        <div className="grid grid-cols-8 gap-2 text-sm">
          {["season", "from", "to", "nightly", "weekly", "monthly", "minNights"].map((f, i) => (
            <input
              key={i}
              type={f === "from" || f === "to" ? "date" : "text"}
              placeholder={f}
              className="border p-2"
              value={form[f]}
              onChange={e => setForm({ ...form, [f]: e.target.value })}
            />
          ))}

          <button
            onClick={addRate}
            className="bg-green-600 text-white rounded cursor-pointer"
          >
            Add
          </button>
        </div>

        {rates.map((rate, i) => (
          <div
            key={i}
            className="grid grid-cols-8 gap-2 border p-2 mt-2 bg-white rounded text-sm"
          >
            <div>{rate.season}</div>
            <div>{rate.from?.slice(0, 10)}</div>
            <div>{rate.to?.slice(0, 10)}</div>
            <div>${rate.nightly}</div>
            <div>${rate.weekly}</div>
            <div>${rate.monthly}</div>
            <div>{rate.minNights}</div>

            <button
              onClick={() => deleteRate(i)}
              className="text-red-600 cursor-pointer"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* ================= EXTRA FEES ================= */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Additional Fees</h3>

        <button
          onClick={() => {
            setFeeForm(emptyFee);
            setEditFeeIndex(null);
            setShowFeeModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded mb-4 cursor-pointer"
        >
          + Add New
        </button>

        {extraFees.map((fee, i) => (
          <div
            key={i}
            className="grid grid-cols-5 gap-2 border p-2 bg-white rounded text-sm mt-2 "
          >
            <div>{fee.name}</div>
            <div>{fee.value}</div>
            <div>{fee.type}</div>
            <div>{fee.option}</div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setFeeForm(fee);
                  setEditFeeIndex(i);
                  setShowFeeModal(true);
                }}
                className="text-blue-600 cursor-pointer"
              >
                Edit
              </button>

              <button
                onClick={() => deleteExtraFee(i)}
                className="text-red-600 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= SUMMARY ================= */}
      {rates.length > 0 && (
        <div className="bg-white p-4 rounded-xl border">
          <h3 className="font-semibold text-lg mb-3">Rate Summary</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><p>Min Nightly</p><b>${minNightly}</b></div>
            <div><p>Max Nightly</p><b>${maxNightly}</b></div>
            <div><p>Avg Nightly</p><b>${avgNightly}</b></div>
            <div><p>Min Nights</p><b>{minNightsOverall}</b></div>
          </div>
        </div>
      )}

      {/* ================= MODAL ================= */}
      {showFeeModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4">
              {editFeeIndex !== null ? "Edit Extra Fee" : "Add Extra Fee"}
            </h3>

            <input
              className="border p-2 w-full mb-2"
              placeholder="Fee Name"
              value={feeForm.name}
              onChange={e => setFeeForm({ ...feeForm, name: e.target.value })}
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Fee Value"
              value={feeForm.value}
              onChange={e => setFeeForm({ ...feeForm, value: e.target.value })}
            />

            <select
              className="border p-2 w-full mb-2"
              value={feeForm.type}
              onChange={e => setFeeForm({ ...feeForm, type: e.target.value })}
            >
              <option value="$">$</option>
              <option value="%">%</option>
            </select>

            <select
              className="border p-2 w-full mb-4"
              value={feeForm.option}
              onChange={e => setFeeForm({ ...feeForm, option: e.target.value })}
            >
              <option value="mandatory">Mandatory</option>
              <option value="optional">Optional</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowFeeModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Close
              </button>

              <button
                onClick={saveExtraFee}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
