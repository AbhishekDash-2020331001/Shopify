import mongoose from "mongoose";
import { BankAccount } from "../models/bankAccount.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Bank } from "../models/bank.model.js";
import { User } from "../models/user.model.js";
import { Transaction } from "../models/transaction.model.js";
import { Order } from "../models/order.model.js";
import { ORDER_STATUS } from "../constants.js";
import { USER_ROLES } from "../constants.js";
import { ApiError } from "../utils/ApiError.js";


const getTransactionRequests = async (req, res) => {
  try {
    const transactionRequests = await Transaction.find({ requestApprovalStatus: false });
    return res.status(200).json(new ApiResponse(200, transactionRequests, "Transaction requests fetched successfully"));
  } catch (error) {
    console.log("Error while fetching transaction requests:", error);
    return res.status(500).json(new ApiResponse(500, {}, error.message));
  }
}

const approveTransactionRequest = async (req, res) => {

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { transactionId } = req.body;
    if (!transactionId) {
      throw new ApiError(400, "Transaction id is required");
    }

    const transactionRequest = await Transaction.findById(transactionId);

    if (!transactionRequest) {
      throw new ApiError(404, "Transaction request not found");
    }

    if (transactionRequest.requestApprovalStatus) {
      throw new ApiError(400, "Transaction request already approved");
    }

    const supplier = await User.findOne({ role: USER_ROLES.supplier });

    if (!supplier) {
      throw new ApiError(404, "Supplier not found");
    }

    const supplierBankAccount = await BankAccount.findOneAndUpdate(
      { accountNo: supplier.accountNo },
      { $inc: { balance: transactionRequest.amount } },
      { new: true, session: session }
    );

    if (!supplierBankAccount) {
      throw new ApiError(400, "Unable to update supplier bank account");
    }

    transactionRequest.requestApprovalStatus = true;
    const updatedTransactionRequest = await transactionRequest.save({ new: true, session: session });

    if (!updatedTransactionRequest) {
      throw new ApiError(400, "Unable to update transaction request");
    }

    const oderRequest = await Order.findByIdAndUpdate(transactionRequest.orderId, { status: ORDER_STATUS.approvedPaid }, { new: true, session: session });

    if (!oderRequest) {
      throw new ApiError(400, "Unable to update order request");
    }

    if (session.inTransaction()) {
      await session.commitTransaction();
    } else {
      throw new ApiError(400, "Session has already been aborted");
    }
    return res.status(200).json(new ApiResponse(200, updatedTransactionRequest, "Transaction request approved successfully"));
  } catch (error) {
    session.abortTransaction();
    console.log("Error while approving transaction request:", error);
    return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, {}, error.message));
  } finally {
    session.endSession();
  }
}

const getAllBankAccounts = async (req, res) => {
  try {
    const accountDetails = await BankAccount.find({});

    accountDetails.map(account => {
      account.accountSecret = undefined;
    })

    return res.status(200).json(new ApiResponse(200, accountDetails, "Accounts fetched successfully"));
  } catch (error) {
    console.log("Error while fetching accounts:", error);
    return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, {}, error.message));
  }
}

const addMoney = async (req, res) => {
  try {
    const { accountNo, amount, accountSecret } = req.body;
    if (!accountNo || !amount) {
      throw new ApiError(400, "All fields are required");
    }

    const numAmount = Number(amount);

    if (isNaN(numAmount)) {
      throw new ApiError(400, "Invalid amount");
    }

    const account = await BankAccount.findOne({ accountNo });

    if (!account) {
      throw new ApiError(404, "Account not found");
    }

    const isAccountSecretValid = await account.isAccountSecretCorrect(accountSecret);

    if (!isAccountSecretValid) {
      throw new ApiError(400, "Invalid credentials");
    }

    account.balance += numAmount;
    const updatedAccount = await account.save({ new: true });

    if (!updatedAccount) {
      throw new ApiError(400, "Unable to add money to the account");
    }

    return res.status(200).json(new ApiResponse(200, updatedAccount, "Money added successfully"));
  } catch (error) {
    console.log("Error while adding money:", error);
    return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, {}, error.message));
  }
}

const createBankAccount = async (req, res) => {
  try {
    const { accountNo, balance, accountSecret } = req.body;
    if (!accountNo || !accountSecret || !balance) {
      throw new ApiError(400, "All fields are required");
    }

    const existingAccount = await BankAccount.findOne({ accountNo });
    if (existingAccount) {
      throw new ApiError(400, "Account already exists");
    }

    const account = await BankAccount.create({
      accountNo,
      accountSecret,
      balance
    });

    if (!account) {
      throw new ApiError(400, "Unable to create bank account");
    }

    account.accountSecret = undefined;
    return res.status(201).json(new ApiResponse(201, account, "Bank account created successfully"));
  } catch (error) {
    console.log("Error while creating bank account:", error);
    return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, {}, error.message));
  }
}

const getTransactionHistory = async (_, res) => {
  try {
    const transactionHistory = await Transaction.find({ requestApprovalStatus: true });
    return res.status(200).json(new ApiResponse(200, transactionHistory, "Transaction history fetched successfully"));
  } catch (error) {
    console.log("Error while fetching transaction history:", error);
    return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, {}, error.message));
  }
}

export { getTransactionRequests, approveTransactionRequest, getAllBankAccounts, addMoney, createBankAccount, getTransactionHistory }