import express from 'express'
import { docbook, doctorinfo} from '../controller/userPageController.js';

const userPageRouter = express.Router();
    userPageRouter.get("/doctorinfo",doctorinfo)
    userPageRouter.get("/doctorBooking/:id",docbook)
    

export default userPageRouter;