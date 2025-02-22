import { Router } from "express";
import { userRoute, verifyJWT } from "../middleware/auth.middleware.js";
import { addBillingInfo, getAccountInfo, getProducts } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/billing-info").post(verifyJWT, userRoute, addBillingInfo);
userRouter.route("/products").get(verifyJWT, userRoute, getProducts);
userRouter.route("/account-info").get(verifyJWT, userRoute, getAccountInfo);

export { userRouter }