import { io } from "socket.io-client";

const socket = io("http://localhost", {
  transports: ["websocket"],
});

export default socket;
