import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { BankAccount } from "../models/bankAccount.model.js";
import { Product } from "../models/product.model.js";
import {ApiError} from "../utils/ApiError.js";


const addBillingInfo = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { accountNo, accountSecret } = req.body;
    if (!accountNo || !accountSecret) {
      throw new ApiError(400, "All fields are required");
    }

    // If user already has an account, return error
    if (req.user.accountNo) {
      throw new ApiError(400, "User already has an account");
    }

    const account = await BankAccount.findOne({ accountNo });
    if (!account) {
      throw new ApiError(404, "Bank account not found");
    }

    if (account.accountName) {
      throw new ApiError(400, "Account belongs to someone else");
    }

    const isAccountSecretCorrect = await account.isAccountSecretCorrect(accountSecret);
    if (!isAccountSecretCorrect) {
      throw new ApiError(400, "Invalid credentials");
    }

    const updatedAccount = await account.updateOne({ $set: { accountName: req.user.name } }, { new: true, session: session });

    if (!updatedAccount) {
      throw new ApiError(400, "Unable to update bank account");
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { accountNo: accountNo } },
      { new: true, session: session },
    );

    if (!updatedUser) {
      throw new ApiError(400, "Unable to update user");
    }


    

    if (session.inTransaction()) {
      await session.commitTransaction();
    } else {
      throw new ApiError(500, "Transaction has already been aborted");
    }

    account.accountSecret = undefined;
    
    res.status(200).json(new ApiResponse(200, account, "Bank info added successfully"));
  } catch (error) {
    session.abortTransaction();
    console.log("Error while adding bank info:", error);
    res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, {}, error.message));
  } finally {
    session.endSession();
  }
}

const getProducts = async (_, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
  } catch (error) {
    console.log("Error while fetching products:", error);
    res.status(500).json(new ApiResponse(500, {}, error.message));
  }
}

const getAccountInfo = async (req, res) => {
  try {
    const account = await BankAccount.findOne({ accountNo: req.user.accountNo });
    if(!account) {
      throw new ApiError(404, "Account not found");
    }

    account.accountSecret = undefined;
    res.status(200).json(new ApiResponse(200, account, "Account info fetched successfully"));
  } catch (error) {
    console.log("Error while fetching account info:", error);
    res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, {}, error.message));
  }
}


export { addBillingInfo, getProducts, getAccountInfo };