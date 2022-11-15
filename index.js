import express from "express"
import cors from 'cors'
import dotenv from "dotenv";
import nodemon from 'nodemon'
import { MongoClient } from 'mongodb'

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const mongoClient =  new MongoClient(process.env.MONGO_URI);
const db = mongoClient.db("myWallet");

try {
    mongoClient.connect();
    console.log("connected database");
  } catch (err) {
    console.log(err);
  }