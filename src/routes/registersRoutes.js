import {
  GetRegisters,
  PostRegister,
} from "../controllers/registersController.js";

import { Router } from "express";
import { validateToken } from "../midlewares/token.middleware.js";

const router = Router();
router.use(validateToken);

router.get("/registers", GetRegisters);

router.post("/registers", PostRegister);

export default router;
