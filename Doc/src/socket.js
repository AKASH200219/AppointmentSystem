import { io } from "socket.io-client";
import API from "./api/axiosConfig";

const socket = io(API.defaults.baseURL, {
  autoConnect: true,
  transports: ["websocket", "polling"],
});

export default socket;
