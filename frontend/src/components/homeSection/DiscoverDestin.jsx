import React from "react";

const experiences = [
  {
    title: "Outdoor Adventures",
    description:
      "Discover the natural beauty of Destin with these exciting outdoor activities:",
    image:
      "https://www.coastaldreamrentals.com/img/home/home-1.jpg",
    list: [
      "Deep Sea Fishing",
      "Parasailing over the Emerald Coast",
      "Kayaking & Paddleboarding",
    ],
  },
  {
    title: "Family Fun",
    description:
      "Have fun with the whole family at these local kid-friendly destinations:",
    image:
      "https://www.coastaldreamrentals.com/img/home/home-2.jpg",
    list: [
      "Big Kahuna's Water & Adventure Park",
      "Dolphin Watching Tours",
      "The Track - Destin Go Carts & Mini Golf",
    ],
  },
  {
    title: "Romantic Getaways",
    description:
      "Have a romantic evening to remember with these activities in Destin:",
    image:
      "https://www.coastaldreamrentals.com/img/home/home-3.jpg",
    list: [
      "Private Sailboat Charter",
      "Beachfront Dining",
      "Spa Day Retreat",
    ],
  },
];

const DiscoverDestinSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-cursive text-sky-900">
          Discover Destin in Luxury
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        {experiences.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-56 object-cover"
            />

            {/* Content */}
            <div className="p-6 text-center">
              <h3 className="text-2xl font-semibold text-sky-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 mb-4">{item.description}</p>

              <ul className="list-disc list-inside text-left space-y-3">
                {item.list.map((point, i) => (
                  <li key={i} className="font-semibold text-gray-900">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DiscoverDestinSection;
