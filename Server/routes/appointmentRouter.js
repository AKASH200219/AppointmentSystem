import express from 'express';
import { ConfirmAppointment, getUserAppointments } from '../controller/appointmentController.js';

const appointmentRouter = express.Router();
appointmentRouter.post("/bookToken/:doctorId", ConfirmAppointment);
appointmentRouter.get("/user/:userId", getUserAppointments);

export default appointmentRouter;