import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemon from "nodemon";
import joi from "joi";
import { MongoClient } from "mongodb";
import { v4 as uuidV4 } from "uuid";
import { UserLogin, UserRegistration } from "./controllers/userController.js";
import { GetRegisters, PostRegister } from "./controllers/registersController.js";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
const token = uuidV4();

export const userSchema = joi.object({
  name: joi.string().required().min(3).max(100),
  email: joi.string().email().required(),
  password: joi.string().required(),
  validatePass: joi.string().required(),
});

export const registerSchema = joi.object({
  value: joi.string().required().min(3),
  description: joi.string().required().min(3).max(100),
  type: joi.string().required().valid("outflow", "deposit"),
});


//Rotas - post
app.post("/sign-up", UserLogin);

app.post("/sign-in", UserRegistration);

app.get("/registers", GetRegisters);

app.post("/registers", PostRegister);

app.listen(5000, () => {
  console.log("Running in port 5000");
});
