import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";

import { registerValidation, loginValidation, taskValidation } from "./validations.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";
import { UserController,TaskController } from "./controllers/index.js";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB ok");
  })
  .catch((err) => {
    console.log("DB error", err);
  });

const app = express();
app.use(express.json());
app.use(cors());

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


app.post(
    "/tasks", 
    checkAuth,               
    taskValidation,          
    handleValidationErrors,  
    TaskController.create   
); 
app.get("/tasks", checkAuth, TaskController.getAll); 
app.post("/tasks/:id/solve", checkAuth, TaskController.solve); 
app.post("/tasks/:id/cancel", checkAuth, TaskController.cancel);



app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
