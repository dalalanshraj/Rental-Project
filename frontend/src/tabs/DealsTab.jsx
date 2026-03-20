import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DealsTab({ listingId }) {

    const today = new Date();
    const [deals, setDeals] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editDeal, setEditDeal] = useState(null);

    const [form, setForm] = useState({
        title: "",
        originalRate: "",
        discountedRate: "",
        displayFrom: null,
        displayEnd: null,
        dealStartDate: null,
        dealEndDate: null,
        description: ""
    });

    // ===== FETCH DEALS =====
    const fetchDeals = async () => {
        const res = await api.get(`/deals/${listingId}`);
        setDeals(res.data || []);
    };

    useEffect(() => {
        if (listingId) fetchDeals();
    }, [listingId]);

    // ===== DELETE DEAL =====
    const deleteDeal = async (id) => {
        if (!confirm("Delete deal?")) return;

        await api.delete(`/deals/${id}`);
        fetchDeals();
    };

    // ===== SAVE DEAL =====
    const saveDeal = async () => {

        const payload = {
            ...form,
            listingId,
            displayFrom: form.displayFrom?.toISOString(),
            displayEnd: form.displayEnd?.toISOString(),
            dealStartDate: form.dealStartDate?.toISOString(),
            dealEndDate: form.dealEndDate?.toISOString(),
        };
// console.log("LISTING ID 👉", listingId);
// console.log("PAYLOAD 👉", payload);
        if (editDeal) {
            await api.put(`/deals/${editDeal._id}`, payload);
        } else {
            await api.post(`/deals`, payload);
        }

        setShowForm(false);
        setEditDeal(null);

        setForm({
            title: "",
            originalRate: "",
            discountedRate: "",
            displayFrom: null,
            displayEnd: null,
            dealStartDate: null,
            dealEndDate: null,
            description: ""
        });

        fetchDeals();
    };
    // ===== EDIT DEAL =====
    const openEdit = (d) => {
        setEditDeal(d);

        setForm({
            ...d,
            displayFrom: d.displayFrom ? new Date(d.displayFrom) : null,
            displayEnd: d.displayEnd ? new Date(d.displayEnd) : null,
            dealStartDate: d.dealStartDate ? new Date(d.dealStartDate) : null,
            dealEndDate: d.dealEndDate ? new Date(d.dealEndDate) : null
        });

        setShowForm(true);
    };

    return (
        <div className=" rounded-2xl shadow p-6">

            <div className="flex justify-between mb-6">

                <h2 className="text-2xl font-bold">
                    Property Deals
                </h2>

                {deals.length === 0 && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-blue-600 text-black px-4 py-2 rounded"
                    >
                        <FaPlus />
                        Add Deal
                    </button>
                )}

            </div>

            {/* ===== TABLE ===== */}

            <div className="overflow-x-auto">

                <table className="w-full text-sm border rounded-xl overflow-hidden">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Deal Title</th>
                            <th className="p-3">Original</th>
                            <th className="p-3">Discount</th>
                            <th className="p-3">Display</th>
                            <th className="p-3">Deal Dates</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {deals.map((d) => (

                            <tr key={d._id} className="border-t">

                                <td className="p-3 font-semibold">
                                    {d.title}
                                </td>

                                <td className="p-3 text-center">
                                    ${d.originalRate}
                                </td>

                                <td className="p-3 text-center">
                                    ${d.discountedRate}
                                </td>

                                <td className="p-3 text-center">
                                    {d.displayFrom?.slice(0, 10)} - {d.displayEnd?.slice(0, 10)}
                                </td>

                                <td className="p-3 text-center">
                                    {d.dealStartDate?.slice(0, 10)} - {d.dealEndDate?.slice(0, 10)}
                                </td>

                                <td className="p-3 flex justify-center gap-3">

                                    <button
                                        onClick={() => openEdit(d)}
                                        className="p-2 bg-yellow-100 text-yellow-600 rounded"
                                    >
                                        <FaEdit />
                                    </button>

                                    <button
                                        onClick={() => deleteDeal(d._id)}
                                        className="p-2 bg-red-100 text-red-600 rounded"
                                    >
                                        <FaTrash />
                                    </button>

                                </td>

                            </tr>

                        ))}
                    </tbody>

                </table>

            </div>


            {/* ===== MODAL FORM ===== */}

            {showForm && (

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                    <div className="bg-white p-6 rounded-xl max-w-lg w-full">

                        <h3 className="text-xl font-bold mb-4">

                            {editDeal ? "Edit Deal" : "Add Deal"}

                        </h3>

                        <input
                            placeholder="Deal Title"
                            className="w-full border p-2 mb-3"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />

                        <div className="flex gap-3 mb-3">

                            <input
                                type="number"
                                placeholder="Original Rate"
                                className="w-full border p-2"
                                value={form.originalRate}
                                onChange={(e) => setForm({ ...form, originalRate: e.target.value })}
                            />

                            <input
                                type="number"
                                placeholder="Discounted Rate"
                                className="w-full border p-2"
                                value={form.discountedRate}
                                onChange={(e) => setForm({ ...form, discountedRate: e.target.value })}
                            />

                        </div>

                        <div className="flex gap-3 mb-3">

                            <DatePicker
                                selected={form.displayFrom}
                                onChange={(date) => setForm({ ...form, displayFrom: date })}
                                minDate={today}
                                className="w-full border p-2 rounded"
                                placeholderText="Display From"
                            />

                            <DatePicker
                                selected={form.displayEnd}
                                onChange={(date) => setForm({ ...form, displayEnd: date })}
                                minDate={form.displayFrom || today}
                                className="w-full border p-2 rounded"
                                placeholderText="Display End"
                            />

                        </div>

                        <div className="flex gap-3 mb-3">

                            <DatePicker
                                selected={form.dealStartDate}
                                onChange={(date) => setForm({ ...form, dealStartDate: date })}
                                minDate={today}
                                className="w-full border p-2 rounded"
                                placeholderText="Deal Start Date"
                            />

                            <DatePicker
                                selected={form.dealEndDate}
                                onChange={(date) => setForm({ ...form, dealEndDate: date })}
                                minDate={form.dealStartDate || today}
                                className="w-full border p-2 rounded"
                                placeholderText="Deal End Date"
                            />

                        </div>

                        <textarea
                            placeholder="Description"
                            className="w-full border p-2 mb-4"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />

                        <div className="flex justify-end gap-3">

                            <button
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={saveDeal}
                                className="px-4 py-2 bg-blue-600 text-black rounded"
                            >
                                Save Deal
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}