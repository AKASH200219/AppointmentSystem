import mongoose from "mongoose";

const labTestSchema = new mongoose.Schema(
  {
    labId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lab",
      required: true,
    },
    labName: {
      type: String,
      default: "Central Diagnostic Lab",
    },
    testName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      default: "Blood Test",
    },
    price: {
      type: Number,
      required: true,
    },
    reportTime: {
      type: String,
      default: "24 Hours",
    },
    preparation: {
      type: String,
      default: "Fasting not required",
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available",
    },
  },
  { timestamps: true }
);

const LabTest = mongoose.model("LabTest", labTestSchema);

export default LabTest;
