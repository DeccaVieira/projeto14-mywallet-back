import { UserLogin, UserRegistration } from "../controllers/userController.js";

import { Router } from "express";

const userRouter = Router();

userRouter.post("/sign-up", UserRegistration);

userRouter.post("/sign-in", UserLogin);

export default userRouter;
