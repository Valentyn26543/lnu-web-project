import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import {
  registerValidation,
  loginValidation,
  taskValidation,
} from "./validations.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";
import { UserController, TaskController } from "./controllers/index.js";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
app.set("trust proxy", 1);

// http сервер поверх express (не замінює app)
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Клієнт підключився:", socket.id);

  socket.on("disconnect", () => {
    console.log("Клієнт відключився:", socket.id);
  });
});

app.set("io", io);

app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post(
  "/tasks",
  checkAuth,
  taskValidation,
  handleValidationErrors,
  TaskController.create
);
app.get("/tasks", checkAuth, TaskController.getAll);
app.get("/tasks/:id", checkAuth, TaskController.getOne);
app.post("/tasks/:id/solve", checkAuth, TaskController.solve);
app.post("/tasks/:id/cancel", checkAuth, TaskController.cancel);

const port = process.env.PORT || 4444;

server.listen(port, (err) => {
  if (err) return console.log(err);
  console.log(`Server OK (Listening on port ${port})`);
});
