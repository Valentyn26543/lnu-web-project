import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

import { registerValidation, loginValidation } from "./validations.js";
import { handleValidationErrors } from "./utils/index.js";
import { UserController } from "./controllers/index.js";

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


app.get("/", (req, res) => {
  res.send("Server OK");
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
