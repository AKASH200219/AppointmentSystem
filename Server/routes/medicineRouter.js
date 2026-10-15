import express from "express";

import upload from "../middleware/multer.js";
import { addMedicine, deleteMedicine, getAllMedicines, getAllOrders, getMedicineById, getUserOrders, orderMedicine, prescriptionByorder, updateMedicine, updateOrderStatus,getPrescriptionFile } from "../controller/medicineController.js";

const medicineRouter = express.Router();

medicineRouter.post("/add", upload.single("image"), addMedicine);
medicineRouter.get("/get", getAllMedicines);
medicineRouter.get("/get/:id", getMedicineById);
medicineRouter.put("/update/:id", upload.single("image"), updateMedicine);
medicineRouter.delete("/delete/:id", deleteMedicine);
medicineRouter.post("/order", orderMedicine);
medicineRouter.get("/user-orders/:userId", getUserOrders);
medicineRouter.get("/orders", getAllOrders);
medicineRouter.put("/update-order-status/:id", updateOrderStatus);
medicineRouter.post("/prescriptionorder",upload.single("prescription"),prescriptionByorder);
medicineRouter.get("/prescription/:orderId", getPrescriptionFile);

export default medicineRouter;
