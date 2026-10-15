import express from "express";
import { getAdminDashboard } from "../controller/adminDashboardController.js";

const adminDashboardRouter = express.Router();

adminDashboardRouter.get("/dashboard", getAdminDashboard);

export default adminDashboardRouter;