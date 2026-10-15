import express from "express";
import {
  prescriptionAdd,
  getPrescriptionAppointment,
  getUserPrescriptions,
  updatePrescription,
  deletePrescription,
} from "../controller/prescriptionController.js";

const prescriptionRouter = express.Router();
prescriptionRouter.post("/add", prescriptionAdd);
prescriptionRouter.get("/appointment/:appointmentId", getPrescriptionAppointment);
prescriptionRouter.get("/user/:userId", getUserPrescriptions);
prescriptionRouter.put("/update/:id", updatePrescription);
prescriptionRouter.delete("/delete/:id", deletePrescription);

export default prescriptionRouter;

    