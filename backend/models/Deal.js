import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
{
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
    unique: true // ek listing par ek hi deal
  },

  title: {
    type: String,
    required: true
  },

  originalRate: {
    type: Number,
    required: true
  },

  discountedRate: {
    type: Number,
    required: true
  },

  displayFrom: {
    type: Date,
    required: true
  },

  displayEnd: {
    type: Date,
    required: true
  },

  dealStartDate: {
    type: Date,
    required: true
  },

  dealEndDate: {
    type: Date,
    required: true
  },

  description: String,

  status: {
    type: String,
    default: "active"
  }
},
{ timestamps: true }
);

export default mongoose.model("Deal", dealSchema);
