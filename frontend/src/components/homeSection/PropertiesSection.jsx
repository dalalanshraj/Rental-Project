// import React, { useEffect, useState } from "react";

// import axios from "axios";
// import PropertyCard from "../PropertyCard";
// // import PropertyCard from "../components/PropertyCard";

// const PropertiesSection = () => {
//   const [properties, setProperties] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:8000/api/properties")
//       .then((res) => {
//         // Sirf first 2 properties lo
//         setProperties(res.data.slice(0, 3));
//       })
//       .catch((err) => console.error("Error fetching properties:", err));
//   }, []);

//   return (
//      <div className="p-10 bg-gray-100 min-h-screen  pt-20">
//       <h2 className="text-3xl font-semibold mb-6 text-center">
//         Available Vacation Rentals
//       </h2>
//       <p className="mx-69 mb-6 text-center">At Coastal Dream Rentals, we offer exquisite vacation properties nestled in Southern Okaloosa, just a stone's throw away from the vibrant beauty of Destin. Experience the serene allure of the coast while enjoying the comfort and luxury our homes provide.</p>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {properties.map((prop) => (
//           // <PropertyCard key={prop._id} property={prop} />
//           <PropertyCard key={prop._id} property={prop}/>
    
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PropertiesSection;
