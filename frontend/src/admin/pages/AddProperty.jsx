import { useState } from "react";
import api from "../../api/axios";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

const AddProperty = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    guests: "",
    bedroom: "",
    bathroom: "",
    basePricePerNight: "",
    cleaningFee: "",
    serviceFeePercent: 5,
    taxesPercent: 7,
    link: "",
    images: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/properties", {
        ...form,
        guests: Number(form.guests),
        bedroom: Number(form.bedroom),
        bathroom: Number(form.bathroom),
        basePricePerNight: Number(form.basePricePerNight),
        cleaningFee: Number(form.cleaningFee),
      });

      alert("Property added successfully ✅");
      navigate("/admin/properties");
    } catch (error) {
      alert("Error adding property ❌");
      console.error(error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="p-6 flex-1">
        <h1 className="text-2xl font-bold mb-4">Add Property</h1>

        <form onSubmit={submit} className="grid grid-cols-2 gap-4">

          <input name="title" placeholder="Title" className="border p-2"
            onChange={handleChange} required />

          <input name="link" placeholder="Slug / Link" className="border p-2"
            onChange={handleChange} required />

          <input name="guests" placeholder="Guests" className="border p-2"
            onChange={handleChange} />

          <input name="bedroom" placeholder="Bedrooms" className="border p-2"
            onChange={handleChange} />

          <input name="bathroom" placeholder="Bathrooms" className="border p-2"
            onChange={handleChange} />

          <input name="basePricePerNight" placeholder="Price / Night"
            className="border p-2" onChange={handleChange} />

          <input name="cleaningFee" placeholder="Cleaning Fee"
            className="border p-2" onChange={handleChange} />

          <input name="images" placeholder="Image URL"
            className="border p-2 col-span-2"
            onChange={handleChange} />
              

          <button
            type="submit"
            
            className="col-span-2 bg-black text-white py-2"
          >
            Add Property
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
