import mongoose from "mongoose";

const medicineOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      // required: true,
    },
    prescription: {
      type: String,
      // required: true,
    },
  
    image: {
      type: String,
      // required: true,
    },
    medicineName: {
      type: String,
      // required: true,
    },
    category: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      // required: true,
    },
    quantity: {
      type: Number,
      // required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      // required: true,
    },
    address: {
      type: String,
      // required: true,
    },
    phone: {
      type: String,
      // required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Delivered", "Cancelled"],
      default: "Pending",
    },
    deliveryTime: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const MedicineOrder = mongoose.model("MedicineOrder", medicineOrderSchema);

export default MedicineOrder;
