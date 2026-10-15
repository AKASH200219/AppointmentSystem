import express from "express";
import { addEquipment, BookingEquip,getEquipForEdit, getAllEquipmentBookings, getEquipment, updateEquipmentBookingStatus, updateEquipment, deleteEquipment,equipmentbookedstatus} from "../controller/equipmentController.js";
import upload from "../middleware/multer.js";
import e from "cors";


const equipmentRouter = express.Router();
    equipmentRouter.post("/add", upload.single("image"), addEquipment);
    equipmentRouter.get("/getequip/:id",getEquipForEdit)
    equipmentRouter.get("/get", getEquipment);
    equipmentRouter.post("/bookingEquipment/:id",BookingEquip)
    equipmentRouter.get("/getBookings", getAllEquipmentBookings);
    equipmentRouter.put("/updateStatus/:id", updateEquipmentBookingStatus)
    equipmentRouter.put("/update/:id",upload.single("image"), updateEquipment);
    equipmentRouter.delete("/deleteequip/:id", deleteEquipment)
    equipmentRouter.get("/equipmentbookedstatus/:userId",equipmentbookedstatus)


export default equipmentRouter;


