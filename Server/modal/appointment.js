import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true
    },

    tokenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Token",
      required: true
    },

    appointmentDate: {
      type: String,
      required: true
    },

    tokenNumber: {
      type: Number,
      required: true
    },

    patientName: {
      type: String,
      required: true
    },

    phone: {
      type: Number,
      required: true
    },

    age: {
      type: Number,
      required: true
    },
    dob:{
      type:String,
      required:true
    },

    symptoms: {
      type: String
    },

    status: {
      type: String,
      default: "Booked"
    }
  },
  {
    timestamps: true
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;