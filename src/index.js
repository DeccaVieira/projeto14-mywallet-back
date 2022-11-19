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
  // type: joi.string().required().valid("outflow", "deposit"),
});

const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
  mongoClient.connect();
  console.log("connected database");
} catch (err) {
  console.log(err);
}
const db = mongoClient.db("myWallet"); //banco de dados

//collections
export const userCollection = db.collection("users"); //coleção de usuário que tem
//"_id": "63742936627b2a6861ec6e48",
// "user": {
//   "name": "Lorenzo",
//   "email": "deca@gmail.com",
//   "password": "123456"
// }
export const sessionCollection = db.collection("session");
// "_id": "637536fc0900135fc213598f",
// "token": "113ad355-87b8-43ec-bc6a-6f550a148218",
// "userId": "63743d6f8d48baddbbe0b604"
// },
export const registerCollection = db.collection("register");

// {
//   "registers": [
//     {
//       "name": "Teste"
//     }
//   ],
//   "user": {
//     "_id": "63750c7474332e6a0e0055cd",
//     "name": "Loren",
//     "email": "lls@gmail.com"
//   }
// }
//Rotas - post
app.post("/sign-up", UserLogin);

app.post("/sign-in", UserRegistration);

app.get("/registers", GetRegisters);

app.post("/registers", PostRegister);

app.listen(5000, () => {
  console.log("Running in port 5000");
});
