import {
  GetRegisters,
  PostRegister,
} from "../controllers/registersController.js";

app.get("/registers", GetRegisters);

app.post("/registers", PostRegister);
