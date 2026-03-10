// import { useEffect, useState } from "react";
// import api from "../../api/axios";
// import Sidebar from "../components/Sidebar";
// import { Link } from "react-router-dom";

// const AdminProperties = () => {
//   const [properties, setProperties] = useState([]);

//   useEffect(() => {
//     api.get("/properties").then(res => setProperties(res.data));
//   }, []);

//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="p-6 flex-1">
//         <h1 className="text-xl mb-4">Properties</h1>

//       {properties.map((p) => (
//   <div key={p._id} className="border p-3 mb-2">
//     <b>{p.title}</b> – ₹{p.basePricePerNight}

//     <Link
//       to={`/admin/properties/edit/${p._id}`}
//       className="ml-4 text-black bg-cyan-300 p-1 border rounded"
//     >
//       Edit
//     </Link>

//     <button
//       onClick={() => api.delete(`/properties/${p._id}`)}
//       className="ml-4 text-white bg-red-600 p-1 border rounded"
//     >
//       Delete
//     </button>
//   </div>
// ))}
//       </div>
//     </div>
//   );
// };

// export default AdminProperties;

import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import ListingCard from "../components/ListingDetails.jsx";
import Sidebar from "../components/Sidebar.jsx";

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/listings")
      .then((res) => {
        setListings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Loading listings...</p>;

  return (
    <>
    <div className="flex">
      <Sidebar />
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Available Properties</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing._id} listing={listing} />
        ))}
      </div>
    </div>

    </div>
    </>
    
  );
};

export default Listings;

