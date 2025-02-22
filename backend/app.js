import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { authRouter } from "./routes/auth.routes.js";
import { bankRouter } from "./routes/bank.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { supplierRouter } from "./routes/supplier.routes.js";
import { eCommerceRouter } from "./routes/e-commerce.routes.js";
import { customerRouter } from "./routes/customer.routes.js";

const app = express();

const clientUrls = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5178",
  "http://localhost:5179",
  "http://localhost:5180",
  "http://localhost:5181",
  "http://localhost:5182",
  "http://localhost:5183",
]

app.use(cors({
  origin: process.env.CORS_ORIGIN.split(",") || clientUrls,
  credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/bank", bankRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/supplier", supplierRouter);
app.use("/api/v1/e-commerce", eCommerceRouter);
app.use("/api/v1/customer", customerRouter);

export { app };