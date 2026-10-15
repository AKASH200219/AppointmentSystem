import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    month: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    token: {
      type: Number,
      required: true,
      min: 1,
    },

    bookedtoken: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

tokenSchema.index({ doctorId: 1, date: 1 }, { unique: true });

export default mongoose.model("Token", tokenSchema);