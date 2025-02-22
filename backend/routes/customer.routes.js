import { Router } from "express";
import { customerRoute, verifyJWT } from "../middleware/auth.middleware.js";
import { addToCart, getCart, getOrderHistory, makePaymentCustomer } from "../controllers/customer.controller.js";

const customerRouter = Router();

customerRouter.route("/add-to-cart").post(verifyJWT, customerRoute, addToCart);
customerRouter.route("/cart").get(verifyJWT, customerRoute, getCart);
customerRouter.route("/payment").post(verifyJWT, customerRoute, makePaymentCustomer);
customerRouter.route("/order-history").get(verifyJWT, customerRoute, getOrderHistory);

export { customerRouter };