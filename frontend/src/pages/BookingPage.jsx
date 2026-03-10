// ===========================================
// FULL BOOKING PAGE (FINAL)
// ===========================================
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { countryStateData } from "../data/countryStateData";

const stripePromise = loadStripe("pk_test_51SVGLJ2L7pwIgu8amWwqZhnzUD062L9WQNxeuIAb1QQpb01SvoEf48XyN1AARDTzB1KTTHgz01A5j69mbmfizoE300zwDOFaZW");


// ================= PAYMENT FORM =================
function PaymentForm({ guest, pricing, formData, selectedMethod, showPopup }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const propertyId = params.get("propertyId");

 const handlePayment = async () => {
  if (!stripe || !elements) return;

  setLoading(true);

  try {
    // CREATE PAYMENT INTENT
    const intentRes = await fetch(`${import.meta.env.VITE_API_URL}/bookings/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: pricing.total }),
    });

    if (!intentRes.ok) throw new Error("Payment intent failed");

    const { clientSecret } = await intentRes.json();

    // STRIPE PAYMENT
    const paymentResult = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: `${guest.firstName} ${guest.lastName}`,
          email: guest.email,
        },
      },
    });

    if (paymentResult.error) {
      setLoading(false);
      return showPopup("Payment Error", paymentResult.error.message);
    }

    // CREATE BOOKING
    const bookingRes = await fetch(`${import.meta.env.VITE_API_URL}/bookings/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        user: guest,
        pricing,
        paymentIntentId: paymentResult.paymentIntent.id,
        propertyId,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: 1,
      }),
    });

    const bookingData = await bookingRes.json();

    if (!bookingRes.ok) {
      throw new Error(bookingData.message || "Booking failed");
    }

    const bookingId = bookingData.bookingId;

    // CONFIRM BOOKING
    await fetch(`${import.meta.env.VITE_API_URL}/bookings/${bookingId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      credentials: "include",
      body: JSON.stringify({ status: "confirmed" }),
    });

    showPopup("Booking Confirmed 🎉", "Payment successful & dates booked!");
  } catch (err) {
    console.error(err);
    showPopup("Payment Failed", "Something went wrong.");
  }

  setLoading(false);
};

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <p className="font-semibold mb-2">
        Selected: <span className="text-indigo-600">{selectedMethod}</span>
      </p>

      <label className="font-medium text-sm mb-2 block">Card Details *</label>
      <div className="border p-4 rounded-lg mb-4 bg-white">
        <CardElement />
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-3 rounded-xl font-semibold"
      >
        {loading ? "Processing..." : "Complete Booking"}
      </button>
    </div>
  );
}

// ================= MAIN PAGE =================
export default function BookingPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const propertyId = params.get("propertyId");
  const navigate = useNavigate();

  const [popup, setPopup] = useState({ show: false, title: "", message: "" });
  const showPopup = (title, message) => setPopup({ show: true, title, message });

  const [guest, setGuest] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    address: "",
    zip: "",
  });

  const [formData, setFormData] = useState({ checkIn: "", checkOut: "" });
  const [pricing, setPricing] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState("");

  // GET DATES FROM URL
  useEffect(() => {
    const ci = params.get("checkIn");
    const co = params.get("checkOut");
    if (ci) setFormData((p) => ({ ...p, checkIn: ci }));
    if (co) setFormData((p) => ({ ...p, checkOut: co }));
  }, []);

  // LOAD PRICE PREVIEW
useEffect(() => {
  if (!formData.checkIn || !formData.checkOut || !propertyId) return;

  const loadPricing = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/bookings/preview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            propertyId,
            checkIn: formData.checkIn,
            checkOut: formData.checkOut,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to load pricing");

      const data = await res.json();
      setPricing(data || {});
    } catch (error) {
      console.error("Pricing error:", error);
    }
  };

  loadPricing();
}, [formData.checkIn, formData.checkOut, propertyId]);

  const handleGuestChange = (e) =>
    setGuest({ ...guest, [e.target.name]: e.target.value });

  const handleContinue = () => {
    if (!guest.firstName || !guest.email) {
      alert("Fill all required fields");
      return;
    }
    setStep(2);
  };

  const pretty = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <>
      {/* HERO */}
      <section className="relative h-[40vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `url(https://www.coastaldreamrentals.com/img/hero-bg-img.jpeg)` }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <h1 className="relative z-10 text-6xl font-extrabold mt-32">Booking</h1>
      </section>

      <div className="max-w-7xl mx-auto p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold mb-4">Guest Info</h2>

              <div className="grid grid-cols-2 gap-4">
                <input name="firstName" placeholder="First name" className="border p-3 rounded"
                  value={guest.firstName} onChange={handleGuestChange} />
                <input name="lastName" placeholder="Last name" className="border p-3 rounded"
                  value={guest.lastName} onChange={handleGuestChange} />
                <input name="email" placeholder="Email" className="border p-3 rounded"
                  value={guest.email} onChange={handleGuestChange} />
                <input name="phone" placeholder="Phone" className="border p-3 rounded"
                  value={guest.phone} onChange={handleGuestChange} />
              </div>

              <button onClick={handleContinue}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl mt-6">
                Continue to Payment
              </button>
            </>
          )}

          {/* STEP 2 PAYMENT */}
          {step === 2 && (
            <>
              <h3 className="font-bold mb-4">Select Payment</h3>

              <div className="flex gap-3 mb-4">
                {["Visa", "MasterCard"].map((m) => (
                  <button key={m} onClick={() => setSelectedMethod(m)}
                    className={`px-4 py-2 border rounded ${selectedMethod === m ? "bg-indigo-600 text-white" : ""}`}>
                    {m}
                  </button>
                ))}
              </div>

              {selectedMethod && (
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    guest={guest}
                    pricing={pricing}
                    formData={formData}
                    selectedMethod={selectedMethod}
                    showPopup={showPopup}
                  />
                </Elements>
              )}

              <button className="mt-4 underline" onClick={() => setStep(1)}>
                Back
              </button>
            </>
          )}
        </div>

        {/* RIGHT SUMMARY */}
        <div className="bg-gray-50 p-6 rounded-2xl shadow">
          <h3 className="font-bold text-lg mb-4">Summary</h3>

          {!pricing ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between">
                <p>Dates</p>
                <p>{pretty(formData.checkIn)} → {pretty(formData.checkOut)}</p>
              </div>

              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>${pricing.subtotal}</p>
              </div>

              <div className="flex justify-between">
                <p>Cleaning</p>
                <p>${pricing.cleaningFee}</p>
              </div>

              <div className="flex justify-between">
                <p>Taxes</p>
                <p>${pricing.taxes}</p>
              </div>

              <div className="flex justify-between font-bold text-xl mt-4">
                <p>Total</p>
                <p>${pricing.total}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* POPUP */}
      {popup.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl">
            <h2 className="text-xl font-bold">{popup.title}</h2>
            <p className="mt-2">{popup.message}</p>
            <button onClick={() => navigate("/")}
              className="bg-indigo-600 text-white px-6 py-2 mt-4 rounded">
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
