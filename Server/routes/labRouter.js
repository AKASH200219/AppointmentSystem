import express from "express";
import upload from "../middleware/multer.js";
import {
  // Labs
  createLab,
  getAllLabs,
  getLabById,
  updateLab,
  deleteLab,
  // Tests
  addLabTest,
  getAllLabTests,
  getLabTestsByLab,
  updateLabTest,
  toggleLabTestStatus,
  deleteLabTest,
  // Staff
  addLabStaff,
  getLabStaff,
  deleteLabStaff,
  // Bookings & Requested Views
  bookLabTest,
  getUserLabBookings,
  getLabBookings,
  getAllLabBookings,
  updateBookingStatus,
  uploadLabReport,
  getLabStats,
} from "../controller/labController.js";

const labRouter = express.Router();

labRouter.post("/add-lab", upload.single("image"), createLab);
labRouter.post("/admin/add-lab", upload.single("image"), createLab);
labRouter.get("/all-labs", getAllLabs);
labRouter.get("/labs/:id", getLabById);
labRouter.put("/update-lab/:id", upload.single("image"), updateLab);
labRouter.put("/admin/update-lab/:id", upload.single("image"), updateLab);
labRouter.delete("/delete-lab/:id", deleteLab);
labRouter.delete("/admin/delete-lab/:id", deleteLab);

labRouter.post("/staff/add", upload.single("image"), addLabStaff);
labRouter.get("/staff/by-lab/:labId", getLabStaff);
labRouter.delete("/staff/:id", deleteLabStaff);


labRouter.post("/add-test", addLabTest);
labRouter.post("/admin/add", addLabTest);
labRouter.get("/tests", getAllLabTests);
labRouter.get("/tests/by-lab/:labId", getLabTestsByLab);
labRouter.get("/admin/tests", getAllLabTests);
labRouter.put("/update-test/:id", updateLabTest);
labRouter.put("/admin/update/:id", updateLabTest);
labRouter.patch("/status-test/:id", toggleLabTestStatus);
labRouter.patch("/admin/status/:id", toggleLabTestStatus);
labRouter.delete("/delete-test/:id", deleteLabTest);
labRouter.delete("/admin/delete/:id", deleteLabTest);


labRouter.post("/book", upload.single("attachmentFile"), bookLabTest);
labRouter.get("/user/:userId", getUserLabBookings);

labRouter.get("/requests/:labId", getLabBookings);
labRouter.get("/bookings", getAllLabBookings);
labRouter.patch("/status/:id", updateBookingStatus);
labRouter.post("/report/:id", upload.single("reportFile"), uploadLabReport);
labRouter.get("/stats", getLabStats);

export default labRouter;
