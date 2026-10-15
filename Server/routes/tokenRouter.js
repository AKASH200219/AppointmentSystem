import express from "express";
import {
  getCommonTokens,
  getTokens,
  setCommonTokens,
} from "../controller/tokenController.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";

const tokenRouter = express.Router();

tokenRouter.post("/addtoken", requireAdmin, setCommonTokens);
tokenRouter.get("/all/:month", requireAdmin, getCommonTokens);
tokenRouter.get("/gettoken/:doctorId", getTokens);

export default tokenRouter;
