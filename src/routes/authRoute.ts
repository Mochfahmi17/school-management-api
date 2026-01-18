import express from "express";
import validate from "../middlewares/validate";
import { loginSchema } from "../schemas/authSchema";
import { currentUserController, loginController, logoutController } from "../controllers/authController";
import authenticate from "../middlewares/authenticate";

const authRouter = express.Router();

//* GET
authRouter.get("/me", authenticate, currentUserController);

//* POST
authRouter.post("/login", validate(loginSchema), loginController);
authRouter.post("/logout", authenticate, logoutController);

export default authRouter;
