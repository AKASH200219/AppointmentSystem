import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRouter.js";
import doctorRouter from "./routes/doctorRouter.js";
import userPageRouter from "./routes/userPageRouter.js";
import tokenRouter from "./routes/tokenRouter.js";
import appointmentRouter from "./routes/appointmentRouter.js";
import prescriptionRouter from "./routes/prescriptionRouter.js";
import companionRouter from "./routes/companionRouter.js";
import equipmentRouter from "./routes/equipmentRouter.js";
import medicineRouter from "./routes/medicineRouter.js";
import staffRouter from "./routes/staffRouter.js";
import adminDashboardRouter from "./routes/adminDashboardRouter.js";
import labRouter from "./routes/labRouter.js";

dotenv.config();

mongoose

  // .connect("mongodb://localhost:27017/DocAppointment")
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Successfully connected to MongoDB");

     httpServer.listen(process.env.PORT || 5000, () => {
      console.log("Server started on port " + (process.env.PORT || 5000));
    });
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });


const server = express();
const httpServer = http.createServer(server);

// Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

server.use(express.json());

server.use(
  cors({
    origin: "http://localhost:5173"
  })
);
// Socket connection
io.on("connection", (socket) => {

  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });

});




// server.listen(5000, () => {
//   console.log("Server started on port 5000");
// });

server.use("/uploads", express.static("uploads"));

server.use("/api/user", userRouter);
server.use("/api/addLogin", authRouter);
server.use("/api/admin", doctorRouter);
server.use("/api/doctorpage", userPageRouter);
server.use("/api/booking", userPageRouter);
server.use("/api/token", tokenRouter);
server.use("/api/usernav", userRouter);
server.use("/api/book", appointmentRouter);
server.use("/api/appointments", doctorRouter);
server.use("/api/doctornav",doctorRouter);
server.use("/api/prescriptions",prescriptionRouter);
server.use("/api/companion",companionRouter);
server.use("/api/equipment",equipmentRouter);
server.use("/api/staff", staffRouter);
server.use("/api/medicine", medicineRouter);
server.use("/api/admin", adminDashboardRouter);
server.use("/api/lab", labRouter);


// Start HTTP + Socket.IO server
// httpServer.listen(5000, () => {
//   console.log("Server started on port 5000");
// });
