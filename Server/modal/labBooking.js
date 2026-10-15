import mongoose from "mongoose";

const labBookingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    patientName: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, default: null },
    gender: { type: String, default: "" },
    address: { type: String, default: "" },
    bookingDate: { type: String, required: true },
    bookingTime: { type: String, required: true },
    labId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lab",
      default: null,
    },
    labName: {
      type: String,
      default: "Central Diagnostic Lab",
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LabTest",
      default: null,
    },
    testName: { type: String, required: true },
    category: { type: String, default: "General" },
    price: { type: Number, default: 0 },
    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Rejected",
        "Sample Collected",
        "Processing",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },
    result: { type: String, default: "" },
    remarks: { type: String, default: "" },
    reportFile: { type: String, default: null },
    attachmentFile: { type: String, default: null }, 
    attachmentType: { type: String, default: "" },
  },
  { timestamps: true }
);

const LabBooking = mongoose.model("LabBooking", labBookingSchema);

export default LabBooking;
