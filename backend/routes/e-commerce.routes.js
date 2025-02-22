import { Router } from "express";
import { eCommerceRoute, verifyJWT } from "../middleware/auth.middleware.js";
import { approveDeliveryRequestECommerce, approveOrderRequestECommerce, getDeliveryRequestsECommerce, getOrderRequestsECommerce } from "../controllers/e-commerce.controller.js";

const eCommerceRouter = Router();

eCommerceRouter.route("/order-requests").get(verifyJWT, eCommerceRoute, getOrderRequestsECommerce);
eCommerceRouter.route("/approve-order").post(verifyJWT, eCommerceRoute, approveOrderRequestECommerce);
eCommerceRouter.route("/delivery-requests").get(verifyJWT, eCommerceRoute, getDeliveryRequestsECommerce);
eCommerceRouter.route("/approve-delivery").post(verifyJWT, eCommerceRoute, approveDeliveryRequestECommerce);

export { eCommerceRouter };