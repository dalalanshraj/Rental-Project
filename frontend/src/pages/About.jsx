import React from "react";

export default function AboutUs() {
  return (
          <>
           <section
        className="relative h-[70vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "url(https://www.coastaldreamrentals.com/img/hero-bg-img.jpeg)",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div >

        <h1 className="relative text-6xl font-extrabold">
          About Us
        </h1>
      </section>
         
    <div className="w-full">

      {/* SECTION 1 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-6 lg:px-16 py-16 bg-gray-100">
      <div className="w-full max-w-4xl mx-auto mt-10">
      <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-2xl shadow-lg">
        <iframe
          src="https://player.vimeo.com/video/875557942"
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>

        <div className="max-w-xl">
  <h2 className="text-4xl md:text-5xl font-medium text-[#355e73] mb-6 leading-snug">
    <span className="font-[cursive]">
      Best Coastal Rental Properties
    </span>
    <br />
    in Florida
  </h2>

  <p className="text-gray-600 text-lg leading-relaxed mb-5">
    John and I founded Jackson's Appliance Repair over 30 years ago.
    As longtime residents of the Gulf Coast, we've cherished its
    white sandy beaches and crystal-clear emerald waters.
  </p>

  <p className="text-gray-600 text-lg leading-relaxed">
    Now, as we embark on a new journey in real estate focusing on
    property management, we invite you to experience our beloved
    fishing village's pristine beauty.
  </p>
</div>
      </section>

      {/* SECTION 2 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-6 lg:px-16 py-16">
       <div className="max-w-xl">
  <h2 className="text-4xl md:text-5xl font-medium text-[#355e73] mb-6 leading-snug">
    <span className="font-[cursive]">
      Experience Your Dream
    </span>
    <br />
    Vacation Home
  </h2>

  <p className="text-gray-600 text-lg leading-relaxed mb-6">
    Experience your dream vacation home in the heart of Destin area.
    Our properties combine luxury with comfort, offering you a slice
    of paradise nestled amidst pristine beaches and emerald waters.
  </p>

  <button className="bg-[#355e73] text-white px-8 py-3 rounded-full hover:bg-[#2c4f60] transition">
    Get in Touch
  </button>
</div>

        <div>
          <img
            src="https://www.coastaldreamrentals.com/img/home/d74d56b0-b8ac-4d34-84c0-ede6d2f0569c.jpeg"
            alt="beach"
            className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* SECTION 3 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-6 lg:px-16 py-16 bg-[#335e7d] text-white">
        <div>
          <img
            src="https://www.coastaldreamrentals.com/img/home/ec881850-7701-45a6-bb46-de3121c8884b.jpg"
            alt="house"
            className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
          />
        </div>

       <div className="max-w-xl">
  <h2 className="text-4xl md:text-5xl font-medium mb-6 leading-snug">
    <span className="font-[cursive]">
      Professional Vacation
    </span>
    <br />
    Property Management
  </h2>

  <p className="text-gray-200 text-lg leading-relaxed mb-4">
    Coastal Dream Rentals is dedicated to providing top-tier property
    management services, ensuring every property receives meticulous
    attention and optimal returns.
  </p>

  <p className="text-gray-200 text-lg leading-relaxed">
    Trust our expertise to maximize your property's potential and
    ensure peace of mind with high-quality service.
  </p>
</div>
      </section>

    </div>
     </>
  );
}
