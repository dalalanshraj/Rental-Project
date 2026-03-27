import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing", 
    required: true
  },

  name: String,
  email: String,
  phone: String,
  message: String,

  Arrival:{
    type:Date,
    required:true,
  },
   Departure:{
    type:Date,
    required:true,
  },

  Adults:String,
  Kids:String,

   isRead: {            
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Inquiry", inquirySchema);
