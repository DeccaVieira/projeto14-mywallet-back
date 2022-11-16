import express from "express"
import cors from 'cors'
import dotenv from "dotenv";
import nodemon from 'nodemon'
import joi from "joi";
import { MongoClient } from 'mongodb'
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt'

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
const token = uuid();

const userSchema = joi.object({
  name: joi.string().required().min(3).max(100),
  email: joi.string().email().required(),
password: joi.string().required(),
})

const mongoClient =  new MongoClient(process.env.MONGO_URI);

try {
  mongoClient.connect();
  console.log("connected database");
} catch (err) {
  console.log(err);
}
const db = mongoClient.db("myWallet");
const userCollection = db.collection("users")

  app.post("/sign-up", async (req,res) => {
    const user = req.body;
    try{
      const userExists = await userCollection.findOne({email: user.email})
    if(userExists){
      return res.status(409).send({message : "Esse email já existe"})
    }

    const {error} = userSchema.validate(user, {abortEarly: false})
if(error){
  const errors = error.details.map(detail => detail.message);
  return res.status(400).send(errors)
}
const hashPassword = bcrypt.hashSync(user.password, 10)
console.log(hashPassword)


await userCollection.insertOne({...user, password: hashPassword})
res.sendStatus(201);
}catch (err) {
  console.log(err)
  res.sendStatus(500)
}

  })

  app.post("/sign-in" ,async (req, res)=> {
    const {email, password} = req.body;
try{
const userExists = await userCollection.findOne({email})
if(!userExists){
  res.sendStatus(401);
}

const passwordOk = bcrypt.compareSync(password, userExists.password)

if(!passwordOk){
  return res.sendStatus(401);
}

res.send({message: `Olá ${userExists.name}, seja bem vindo!`})
} catch (err) {
  console.log(err)
  res.sendStatus(500)
}
  })




  app.listen(5000, () => {
    console.log("Running in port 5000")
  })