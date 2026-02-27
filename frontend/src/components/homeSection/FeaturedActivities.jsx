import React from "react";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";

const activities = [
  {
    id: "crab-island",
    title: "Crab Island",
    category: "$, Excursion",
    description:
      "If you’re wondering how to get to Crab Island during your vacation, it’s not as hard as it looks! The best way to get to Crab Island is by renting a boat.",
    image:
      "https://www.coastaldreamrentals.com/img/Featured-img/Featured-img.jpg",
  },
  {
    id: "pompano-joes",
    title: "Pompano Joes",
    category: "$$, Beach Side Dining",
    description:
      "Pompano Joe's first opened its doors in 1995 and quickly became known for our unique Caribbean style of seafood. Since then, Pompano Joe's has become a local favorite.",
    image:
      "https://www.coastaldreamrentals.com/img/Featured-img/Featured-img1.jpg",
  },
  {
    id: "boat-rentals",
    title: "Boat Rentals",
    category: "$$, Excursions",
    description:
      "There are so many places on the Harbor to rent boats and visit Crab Island and many other local spots. The boating rental options are plentiful in Destin!",
    image:
      "https://www.coastaldreamrentals.com/img/Featured-img/Featured-img2.jpg",
  },
];

const FeaturedActivities = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-cursive text-sky-900">
          Featured Activities
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition duration-300 flex flex-col"
          >
            {/* Image */}
            <img
              src={activity.image}
              alt={activity.title}
              className="w-full h-56 object-cover"
            />

            {/* Blue content box */}
            <div className="bg-[#1565C0] text-white flex flex-col justify-between flex-grow p-6">
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-center">
                  {activity.title}
                </h3>
                <p className="text-sm text-gray-200 text-center mb-4">
                  {activity.category}
                </p>
                <hr className="border-gray-300 mb-4 opacity-40" />
                <p className="text-sm leading-relaxed text-center">
                  {activity.description}
                </p>
              </div>

              {/* View button */}
              <div className="mt-6 flex justify-center">
                <Link
                  to={`/activities/${activity.id}`}
                  className="bg-lime-500 text-white font-semibold text-sm px-5 py-2 rounded-md shadow hover:bg-lime-600 transition inline-block"
                >
                    <div className="flex gap-1 ">
                <IoSearch className="mt-1" /> VIEW

                    </div>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedActivities;
