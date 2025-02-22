import { Router } from "express";
import { signup, login, logout, refreshAccessToken, logoutFromAllDevices, getUser } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.route("/signup").post(signup);
authRouter.route("/login").post(login);
authRouter.route("/logout").post(verifyJWT, logout);
authRouter.route("/logout-all").post(verifyJWT, logoutFromAllDevices);
authRouter.route("/user").get(verifyJWT, getUser);
authRouter.route("/refresh-access-token").post(refreshAccessToken);

export { authRouter };