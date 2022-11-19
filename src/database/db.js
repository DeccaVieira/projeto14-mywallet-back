import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

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