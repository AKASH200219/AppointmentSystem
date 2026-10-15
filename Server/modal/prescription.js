import mongoose, { Schema } from "mongoose";

const prescriptionSchema = new Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    medicine: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    instruction: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;