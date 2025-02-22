import { Router } from "express";
import {  approveSupplyRequestSupplier, createProductSupplier, getSupplyRequestsSupplier } from "../controllers/supplier.controller.js";
import { supplierRoute, verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const supplierRouter = Router();

supplierRouter.route("/supply-requests").get(verifyJWT, supplierRoute, getSupplyRequestsSupplier);
supplierRouter.route("/approve-supply").post(verifyJWT, supplierRoute, approveSupplyRequestSupplier);
supplierRouter.route("/create-product").post(verifyJWT, supplierRoute, upload.single("imageUrl"), createProductSupplier);

export { supplierRouter };