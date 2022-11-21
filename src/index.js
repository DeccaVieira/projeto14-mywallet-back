import express from "express";
import cors from "cors";
import joi from "joi";
import userRouters from "./routes/userRoutes.js";
import router from "./routes/registersRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(userRouters);
app.use(router);


app.listen(5000, () => {
  console.log("Running in port 5000");
});
