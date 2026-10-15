import mongoose from "mongoose";

const labSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    timing: {
      type: String,
      default: "07:00 AM - 08:30 PM",
    },
    description: {
      type: String,
      default: "Full-service clinical diagnostics and pathology laboratory with advanced testing facilities.",
    },
    accreditation: {
      type: String,
      default: "NABL & ICMR Approved",
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    features: {
      type: [String],
      default: [
        "Home Sample Collection",
        "Online Digital Reports",
        "Certified Pathologists",
        "Express 6-24hr Turnaround",
      ],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    commonKey: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Login",
      default: null,
    },
  },
  { timestamps: true }
);

const Lab = mongoose.model("Lab", labSchema);

export default Lab;
