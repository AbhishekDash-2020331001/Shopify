import { Router } from "express";
import { getTransactionRequests, createBankAccount, getAllBankAccounts, addMoney, approveTransactionRequest, getTransactionHistory } from "../controllers/bank.controller.js";
import { bankRoute, verifyJWT } from "../middleware/auth.middleware.js";

const bankRouter = Router();


bankRouter.route("/transaction-requests").get(verifyJWT, bankRoute, getTransactionRequests);
bankRouter.route("/approve-transaction/").post(verifyJWT, bankRoute, approveTransactionRequest);
bankRouter.route("/add-money/").post(verifyJWT, bankRoute, addMoney);
bankRouter.route("/accounts").get(verifyJWT, bankRoute, getAllBankAccounts);
bankRouter.route("/create-account").post(verifyJWT, bankRoute, createBankAccount);
bankRouter.route("/transaction-history").get(verifyJWT, bankRoute, getTransactionHistory);

export { bankRouter };