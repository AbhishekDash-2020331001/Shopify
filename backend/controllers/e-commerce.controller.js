import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.model.js";
import { getFormattedOrderRequests } from "../utils/formattedOrder.js";
import { ORDER_STATUS, USER_ROLES } from "../constants.js";
import { Transaction } from "../models/transaction.model.js";
import { User } from "../models/user.model.js";
import { BankAccount } from "../models/bankAccount.model.js";


const getOrderRequestsECommerce = async (req, res) => {

  try {
    const orderRequests = await Order.find({ status: ORDER_STATUS.pending, inCart: false });

    const formattedOrderRequests = await getFormattedOrderRequests(orderRequests);

    return res.status(200).json(new ApiResponse(200, formattedOrderRequests, "Order requests fetched successfully"));

  } catch (error) {
    console.log("Error while fetching e-commerce order requests:", error);
    return res.status(500).json(new ApiResponse(500, {}, error.message));
  } finally {
  }
}

const approveOrderRequestECommerce = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.body;
    if (!orderId) {
      throw new ApiError(400, "Order id is required");
    }

    // Fetch order and e-commerce details in parallel
    const [orderRequest, eCommerce] = await Promise.all([
      Order.findById(orderId),
      User.findById(req.user._id),
    ]);

    // Error if order or eCommerce user not found
    if (!orderRequest) throw new ApiError(404, "Order request not found");
    if (!eCommerce) throw new ApiError(404, "E-Commerce not found");

    // Error if order is not pending
    if (orderRequest.status !== ORDER_STATUS.pending) {
      throw new ApiError(400, "The order request has already been approved");
    }

    // Check if transaction request has already been made

    // Find e-commerce's bank account
    const eCommerceBankAccount = await BankAccount.findOne({ accountNo: eCommerce.accountNo });
    if (!eCommerceBankAccount) throw new ApiError(404, "E-Commerce bank account not found");

    // Check for sufficient balance
    if (eCommerceBankAccount.balance < orderRequest.amount) {
      throw new ApiError(400, "E-Commerce bank account has insufficient balance");
    }

    // Find supplier for the transaction
    const supplier = await User.findOne({ role: USER_ROLES.supplier });
    if (!supplier) throw new ApiError(404, "Supplier not found");

    // Create transaction request
    const transactionRequest = await Transaction.create([{
      from: eCommerce.accountNo,
      to: supplier.accountNo,
      orderId,
      amount: orderRequest.amount,
    }], { session });

    if (!transactionRequest) throw new ApiError(400, "Unable to create transaction request");

    // Update e-commerce's bank account balance
    eCommerceBankAccount.balance -= orderRequest.amount;
    const updatedECommerceBankAccount = await eCommerceBankAccount.save({ new: true, session });

    if (!updatedECommerceBankAccount) throw new ApiError(400, "Unable to update e-commerce bank account");

    // Update order request status
    orderRequest.status = ORDER_STATUS.approvedUnpaid;
    const updatedOrderRequest = await orderRequest.save({ new: true, session });

    if (!updatedOrderRequest) throw new ApiError(400, "Unable to update order status");

    // Commit transaction
    await session.commitTransaction();

    return res.status(200).json(new ApiResponse(200, updatedOrderRequest, "Order request approved successfully"));
  } catch (error) {
    console.log("Error while approving e-commerce order request:", error);
    await session.abortTransaction();
    return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, {}, error.message));
  } finally {
    session.endSession();
  }
};

const getDeliveryRequestsECommerce = async (req, res) => {
  try {
    const deliveryRequests = await Order.find({ status: ORDER_STATUS.shipping });

    const formattedDeliveryRequests = await getFormattedOrderRequests(deliveryRequests);

    return res.status(200).json(new ApiResponse(200, formattedDeliveryRequests, "Delivery requests fetched successfully"));
  } catch (error) {
    console.log("Error while fetching e-commerce delivery requests:", error);
    return res.status(500).json(new ApiResponse(500, {}, error.message));
  }
}

const approveDeliveryRequestECommerce = async (req, res) => {

  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json(new ApiResponse(400, {}, "Order id is required"));
    }

    const deliveryRequest = await Order.findById(orderId);

    if (!deliveryRequest) {
      throw new ApiError(404, "Delivery request not found");
    }

    deliveryRequest.status = ORDER_STATUS.delivered;
    const updatedDeliveryRequest = await deliveryRequest.save({ new: true });

    if (!updatedDeliveryRequest) {
      throw new ApiError(400, "Unable to approve delivery request");
    }

    return res.status(200).json(new ApiResponse(200, updatedDeliveryRequest, "Delivery request approved successfully"));
  } catch (error) {
    console.log("Error while approving e-commerce delivery request:", error);
    return res.status(500).json(new ApiResponse(500, {}, error.message));
  }
}

export { getOrderRequestsECommerce, approveOrderRequestECommerce, getDeliveryRequestsECommerce, approveDeliveryRequestECommerce };