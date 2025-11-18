import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

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

const server = http.createServer(app);

const pubClient = createClient({ url: "redis://redis:6379" });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()])
  .then(() => {
    const io = new Server(server, {
      cors: { origin: "*" },
    });

    io.adapter(createAdapter(pubClient, subClient));

    io.on("connection", (socket) => {
      console.log("Клієнт підключився:", socket.id);

      socket.on("disconnect", () => {
        console.log("Клієнт відключився:", socket.id);
      });
    });

    app.set("io", io);

    const port = 4444;

    server.listen(port, (err) => {
      if (err) return console.log(err);
      console.log(`Server OK (Listening on port ${port})`);
    });
  })
  .catch((err) => {
    console.error("Redis connection failed and server NOT started!", err);
    process.exit(1);
  });

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
