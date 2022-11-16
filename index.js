import express from "express"
import cors from 'cors'
import dotenv from "dotenv";
import nodemon from 'nodemon'
import joi from "joi";
import { MongoClient } from 'mongodb'
import { v4 as uuidV4 } from 'uuid';
import bcrypt from 'bcrypt'

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const userSchema = joi.object({
  name: joi.string().required().min(3).max(100),
  email: joi.string().email().required(),
password: joi.string().required(),
validatePass: joi.string().required(),
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
const sessionCollection = db.collection("session")
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
    if(user.validatePass !== user.password){
      return res.status(409).send({message : "Senha incorreta"})
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

const token = uuidV4();
app.post("/sign-in" ,async (req, res)=> {
  const {email, password} = req.body;
  console.log(token)
try{
const userExists = await userCollection.findOne({email})
if(!userExists){
  res.sendStatus(401);
}

const passwordOk = bcrypt.compareSync(password, userExists.password)

if(!passwordOk){
  return res.sendStatus(401);
}

await sessionCollection.insertOne({
  token, 
  userId: userExists._id
})
res.send({token})
} catch (err) {
  console.log(err)
  res.sendStatus(500)
}
  })

app.get("/registers", async (req,res) => {
   
  const {authorization} = req.headers;

  const token = authorization?.replace("Bearer ", "")
  console.log(token)

  if(!token) {
   return res.sendStatus(401);
  }

  try{
    const session = await sessionCollection.findOne({token})
   console.log({session}.userId);
   const user = await userCollection.findOne({_id: session.userId})

   if(!user){
    return res.sendStatus(401)
   }
delete user.password;

    res.send({register, user})

  }catch (err) {
    console.log(err)
    res.status(500).send("Registro não encontrado")
  }
}
)


  app.listen(5000, () => {
    console.log("Running in port 5000")
  })