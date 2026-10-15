import express from "express";
import { deleteStaff, staffinfo, staffReg, updateStaff, viewStaff } from "../controller/staffController.js";
import upload from "../middleware/multer.js";


const staffRouter=express.Router();
    staffRouter.post("/registeStaff",upload.single("image"),staffReg);
    staffRouter.get("/viewStaff",viewStaff)
    staffRouter.get("/staffinfo/:staffId",staffinfo)
    staffRouter.put("/updateStaff/:staffId" ,upload.single("image"),updateStaff)
    staffRouter.delete("/deleteStaff/:staffId",deleteStaff)

export default staffRouter;
