import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Sidebar from "../components/Sidebar";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    guests: "",
    bedroom: "",
    bathroom: "",
    basePricePerNight: "",
    cleaningFee: "",
    serviceFeePercent: "",
    taxesPercent: "",
    link: "",
    images: "",
  });

  // 🔹 Load property data
  useEffect(() => {
    api.get(`/properties/${id}`).then((res) => {
      setForm(res.data);
    });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/properties/${id}`, {
        ...form,
        guests: Number(form.guests),
        bedroom: Number(form.bedroom),
        bathroom: Number(form.bathroom),
        basePricePerNight: Number(form.basePricePerNight),
        cleaningFee: Number(form.cleaningFee),
      });

      alert("Property updated successfully ✅");
      navigate("/admin/properties");
    } catch (err) {
      console.error(err);
      alert("Error updating property ❌");
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="p-6 flex-1">
        <h1 className="text-2xl font-bold mb-4">Edit Property</h1>

        <form onSubmit={submit} className="grid grid-cols-2 gap-4">

          <input name="title" value={form.title}
            onChange={handleChange} className="border p-2" />

          <input name="link" value={form.link}
            onChange={handleChange} className="border p-2" />

          <input name="guests" value={form.guests}
            onChange={handleChange} className="border p-2" />

          <input name="bedroom" value={form.bedroom}
            onChange={handleChange} className="border p-2" />

          <input name="bathroom" value={form.bathroom}
            onChange={handleChange} className="border p-2" />

          <input name="basePricePerNight"
            value={form.basePricePerNight}
            onChange={handleChange}
            className="border p-2" />

          <input name="cleaningFee"
            value={form.cleaningFee}
            onChange={handleChange}
            className="border p-2" />

          <input name="image"
            value={form.images}
            onChange={handleChange}
            className="border p-2 col-span-2" />

          <button
            type="submit"
            className="col-span-2 bg-black text-white py-2"
          >
            Update Property
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
