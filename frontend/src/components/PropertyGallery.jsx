import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { IoSearch } from "react-icons/io5";

const PropertyGallery = ({ images = [] }) => {
  const [open, setOpen] = useState(false);

  // ✅ fallback image
  const mainImage =
    images && images.length > 0
      ? images[0]
      : "https://res.cloudinary.com/rws-ecbyo/image/upload/f_auto,q_auto,w_auto,dpr_auto,c_fill,g_auto/278811e9e14d4feb92b3642316db2a63.jpg";

  return (
    <div className="relative w-full">

      {/* MAIN IMAGE */}
      <img
        src={mainImage}
        alt="Property"
        className="w-full h-[80vh] object-cover"
      />

      {/* OVERLAY */}
      {images.length > 0 && (
        <div
          className="absolute inset-0 flex justify-center items-center bg-black/40 text-white text-[28px] font-semibold cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <IoSearch className="mr-2" />
          View Photos
        </div>
      )}

      {/* LIGHTBOX SLIDER */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={images.map((img) => ({ src: img }))}
      />
    </div>
  );
};

export default PropertyGallery;
