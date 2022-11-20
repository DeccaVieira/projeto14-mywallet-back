import { UserLogin, UserRegistration } from "../controllers/userController.js";

import {Router} from "express";
// import {userSchema}  from "../midlewares/userSchema.js";


const userRouter = Router();

// userRouter.use(userSchema);
userRouter.post("/sign-up", UserRegistration);

userRouter.post("/sign-in", UserLogin);

export default userRouter;