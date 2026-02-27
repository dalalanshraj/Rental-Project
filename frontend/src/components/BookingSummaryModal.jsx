// BookingSummary.jsx
import React from "react";

export default function BookingSummary({ property, checkIn, checkOut, guests, onBook }) {
  const pricing = calcPricingFrontend(property.basePricePerNight, checkIn, checkOut, property.cleaningFee, property.serviceFeePercent, property.taxesPercent);

  return (
    <div className="p-4 bg-white rounded shadow">
      <img src={property.image} className="w-full h-40 object-cover rounded" />
      <h2 className="text-xl font-semibold">{property.title}</h2>
      <p>{checkIn} → {checkOut} • {pricing.nights} nights</p>

      <div className="mt-4 text-sm">
        <div className="flex justify-between"><span>Nightly x {pricing.nights}</span><span>${pricing.baseTotal}</span></div>
        <div className="flex justify-between"><span>Cleaning</span><span>${pricing.cleaningFee}</span></div>
        <div className="flex justify-between"><span>Service ({property.serviceFeePercent}%)</span><span>${pricing.serviceFee}</span></div>
        <div className="flex justify-between"><span>Taxes</span><span>${pricing.taxes}</span></div>
        <hr className="my-2" />
        <div className="flex justify-between font-bold"><span>Total</span><span>${pricing.total}</span></div>
      </div>

      <button onClick={() => onBook(pricing)} className="mt-4 bg-sky-600 text-white px-4 py-2 rounded">Book & Pay</button>
    </div>
  );
}
