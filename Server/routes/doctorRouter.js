import express from 'express';
import { docinfo, docReg, viewDoctors, updateDoctor, deleteDoctor } from '../controller/doctorController.js';
import upload from '../middleware/multer.js';
import { DetailsAppointment, getAppointments, getDetails, updateStatus } from '../controller/appointmentController.js';

const doctorRouter = express.Router();
doctorRouter.post("/RegDocs", upload.single("image"), docReg);
doctorRouter.get("/viewDoctors", viewDoctors);
doctorRouter.get("/doctorinfo/:doctorid", docinfo);
doctorRouter.put("/updateDoctor/:doctorid", upload.single("image"), updateDoctor);
doctorRouter.delete("/deleteDoctor/:doctorid", deleteDoctor);
doctorRouter.get('/getappointment/:doctorid', getAppointments);
doctorRouter.put('/status/:id', updateStatus);
doctorRouter.get("/getDetails/:Doctorid", getDetails);
doctorRouter.get("/detailsAppointment/:appointmentId", DetailsAppointment);

export default doctorRouter;