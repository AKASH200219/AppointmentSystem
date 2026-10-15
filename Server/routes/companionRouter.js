import express from "express";
import {
  companionAdd,
  companiondetails,
  companionStatus,
  getCompanions,
  updateCompanionStatus,
  assignCompanionDetails,
} from "../controller/companionController.js";

const companionRouter = express.Router();
companionRouter.post("/addCompanion", companionAdd);
companionRouter.get("/allDetails", getCompanions);
companionRouter.put("/updateStatus/:id", updateCompanionStatus);
companionRouter.put("/assignCompanion/:id", assignCompanionDetails);
companionRouter.get("/companionStatus/:userId", companionStatus);
companionRouter.get("/companioncare/:companionId", companiondetails);

export default companionRouter;
