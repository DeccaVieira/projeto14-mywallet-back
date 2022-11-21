import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
  mongoClient.connect();
  console.log("connected database");
} catch (err) {
  console.log(err);
}
const db = mongoClient.db("myWallet");

export const userCollection = db.collection("users");

export const sessionCollection = db.collection("session");

export const registerCollection = db.collection("register");
