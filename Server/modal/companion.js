import mongoose from "mongoose";

const companionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    companionId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",         
    },
    selectService: {
      type: String,
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    Age: {
      type: Number,
      required: true,
    },
    Gender: {
      type: String,
      required: true,
    },
    PreferredDate: {
      type: String,
      required: true,
    },
    PreferredTime: {
      type: String,
      required: true,
    },
    phone:{
      type:String,
      required:true,
      
    },
    Address: {
      type: String,
      required: true,
    },
    latitude: {
  type: Number,
   },

longitude: {
  type: Number,
},
    status: {
      type: String,
      default: "Pending",
    },
    assignedCompanionName: {
      type: String,
      default: "",
    },
    assignedCompanionPhone: {
      type: String,
      default: "",
    },
    assignedLocation: {
      type: String,
      default: "",
    },
    companionLatitude: {
      type: Number,
    },
    companionLongitude: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Companion = mongoose.model("Companion", companionSchema);

export default Companion;
