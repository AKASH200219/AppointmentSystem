import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    rentprice: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    information: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Equipment = mongoose.model("Equipment", equipmentSchema);

export default Equipment;