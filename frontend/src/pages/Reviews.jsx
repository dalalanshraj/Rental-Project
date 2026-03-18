import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { Link } from "react-router-dom";
import ReviewModal from "../components/ReviewModal";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await api.get(
        "/listings/reviews"
      );

      setReviews(res.data.reviews || res.data || []);
    } catch (err) {
      console.error(err);
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <>
     {/* HERO */}
      <section
        className="relative h-[70vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "url(https://www.coastaldreamrentals.com/img/hero-bg-img.jpeg)",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div >

        <h1 className="relative text-6xl font-extrabold">
          All Reviews
        </h1>
      </section>
   
    <div className="max-w-6xl mx-auto p-6 pt-20">

      <h1 className="text-3xl text-center mb-4">Reviews</h1>

      {/* <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Write Review
        </button>
      </div> */}

      <div className="space-y-6">
        {reviews.map((item) => (
          <div key={item._id} className="flex gap-4 shadow p-4 rounded">

            <img
              src={
                item.property?.image
                  ? `${import.meta.env.VITE_API_URL}${item.property.image}`
                  : "/no-image.png"
              }
              alt=""
              className="w-32 h-24 rounded-lg object-cover"
            />

            <div className="flex-1">
              <h2>{item.property?.title}</h2>
              <p>{item.review}</p>
              <p className="text-sm text-blue-500">{item.user}</p>
            </div>

            <Link
              to={`/listing/${item.listingId}`}
              className="bg-green-500 text-white px-1 py-1 rounded"
            >
              READ REVIEWS
            </Link> 
          </div>
        ))}
      </div>

      {/* {showModal && (
        <ReviewModal onClose={() => setShowModal(false)} />
      )} */}
    </div>
     </>
  );
} 