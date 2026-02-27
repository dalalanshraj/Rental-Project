// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const ReviewsSection = ({ propertyId }) => {
//   const [reviews, setReviews] = useState([]);
//   const [newReview, setNewReview] = useState("");
//   const [showForm, setShowForm] = useState(false);

//   // 🟢 Load reviews for this property
//   useEffect(() => {
//     if (!propertyId) return;

//     axios
//       .get(`http://localhost:8000/api/reviews/property/${propertyId}`)
//       .then((res) => {
//         setReviews(res.data);
//       })
//       .catch((err) => console.error("Error fetching reviews:", err));
//   }, [propertyId]);

//   // 🟢 Handle new review submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!newReview.trim()) return;

//     try {
//       const res = await axios.post("http://localhost:8000/api/reviews", {
//         propertyId,
//         name: "Guest User",
//         date: new Date(),
//         comment: newReview,
//       });

//       // instantly show new review
//       setReviews((prev) => [...prev, res.data]);
//       setNewReview("");
//       setShowForm(false);
//     } catch (error) {
//       console.error("Error adding review:", error);
//     }
//   };

//   return (
//     <div className="mt-8">
//       {/* 🟢 Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-semibold">Reviews</h2>
//         <button
//           className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded"
//           onClick={() => setShowForm(!showForm)}
//         >
//           WRITE REVIEW
//         </button>
//       </div>

//       {/* 🟢 Review Form */}
//       {showForm && (
//         <form
//           onSubmit={handleSubmit}
//           className="bg-gray-50 p-4 rounded-lg mb-6 shadow"
//         >
//           <textarea
//             className="w-full border border-gray-300 rounded p-2 mb-2"
//             rows="3"
//             placeholder="Write your review..."
//             value={newReview}
//             onChange={(e) => setNewReview(e.target.value)}
//           ></textarea>
//           <button
//             type="submit"
//             className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
//           >
//             Submit
//           </button>
//         </form>
//       )}

//       {/* 🟢 Reviews List */}
//       <div className="space-y-4">
//         {reviews.map((review) => (
//           <div
//             key={review._id}
//             className="border rounded-lg p-4 bg-white shadow-sm"
//           >
//             <div className="flex items-start space-x-3">
//               <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
//               <div className="flex-1">
//                 <p className="font-semibold">{review.name}</p>
//                 <p className="text-sm text-gray-500">
//                   {new Date(review.date).toLocaleDateString()}
//                 </p>
//                 <p className="mt-2 text-gray-800">{review.comment}</p>

//                 {/* 🟢 Owner Reply */}
//                 {review.reply && (
//                   <div className="mt-3 pl-3">
//                     <p className="font-semibold text-center text-gray-700">
//                       Owner Reply
//                     </p>
//                     <div className="flex items-center justify-between bg-sky-500 text-white p-3 rounded-lg mt-1">
//                       <span>{review.reply}</span>
//                       <img
//                         src="https://i.imgur.com/6VBx3io.png"
//                         alt="Owner"
//                         className="w-8 h-8 rounded-full border-2 border-white"
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}

//         {reviews.length === 0 && (
//           <p className="text-gray-500 italic">No reviews yet. Be the first!</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReviewsSection;
