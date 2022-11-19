import { UserLogin, UserRegistration } from "../controllers/userController.js";

app.post("/sign-up", UserLogin);

app.post("/sign-in", UserRegistration);
