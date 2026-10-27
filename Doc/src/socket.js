import { io } from "socket.io-client";

const socket = io(API_BASE_URL, {
  autoConnect: true,
  transports: ["websocket", "polling"],
});

export default socket;
