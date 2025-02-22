import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.model.js";
import { USER_ROLES } from "../constants.js";
import { User } from "../models/user.model.js";
import { BankAccount } from "../models/bankAccount.model.js";
import { Transaction } from "../models/transaction.model.js";
import { Product } from "../models/product.model.js";
import { getFormattedOrderDetails } from "../utils/formattedOrder.js";

const addToCart = async (req, res) => {
  // Check if already customer have made a order and the order is in cart
  // If not then create a order from the customer
  // Add the product to the order as a key value pair -> { productId: quantity }

  try {

    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      throw new ApiError(400, "All fields are required");
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const existingOrderInCart = await Order.findOne({ from: req.user._id, inCart: true });

    const amount = product.price * quantity;

    const orderInCart = existingOrderInCart || await Order.create({
      from: req.user._id,
      products: { [productId]: quantity },
      amount: amount
    });

    if (!orderInCart) {
      throw new ApiError(400, "Unable to add product to cart");
    }

    if (existingOrderInCart) {
      const previousQuantity = existingOrderInCart.products.get(productId) || 0;
      orderInCart.products.set(productId, previousQuantity + quantity);

      orderInCart.amount = orderInCart.amount ? orderInCart.amount + amount : amount;

      // If the product Quantity is 0 then remove the product from the order
      if (orderInCart.products.get(productId) === 0) {
        orderInCart.products.delete(productId);
      }
    }

    // If the amount is 0 then remove the order from the cart
    const updatedOrderInCart = orderInCart.amount === 0 ? await orderInCart.deleteOne() : await orderInCart.save({ new: true });

    if (!updatedOrderInCart) {
      throw new ApiError(400, "Unable to update order in cart");
    }

    updatedOrderInCart.acknowledged = undefined;
    updatedOrderInCart.deletedCount = undefined;

    const productIds = Array.from(orderInCart.products.keys());

    const products = await Product.find({ _id: { $in: productIds } });

    const formattedCart = getFormattedOrderDetails(updatedOrderInCart, products);


    return res.status(200).json(new ApiResponse(200, formattedCart, "Product added to cart successfully"));
  } catch (error) {
    console.log("Error while adding to cart:", error);
    return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, {}, error.message));
  }

}

const getCart = async (req, res) => {
  try {
    const cart = await Order.findOne({ from: req.user._id, inCart: true }) || { products: new Map() };

    const productIds = Array.from(cart.products.keys());

    const products = await Product.find({ _id: { $in: productIds } });

    // If the cart.products.size !== 0 but the products array is empty then throw an error
    if (cart.products.size !== 0 && products.length === 0) {
      throw new ApiError(400, "Unable to fetch cart products");
    }

    const formattedCart = getFormattedOrderDetails(cart, products);

    return res.status(200).json(new ApiResponse(200, formattedCart, "Cart fetched successfully"));
  } catch (error) {
    console.log("Error while fetching cart:", error);
    return res.status(500).json(new ApiResponse(500, {}, error.message));
  }
}

const getOrderHistory = async (req, res) => {
  try {
    const orderHistory = await Order.find({ from: req.user._id, inCart: false });

    const formattedOrderHistory = [];

    for (const order of orderHistory) {
      const productIds = Array.from(order.products.keys());
      const products = await Product.find({ _id: { $in: productIds } });
      const formattedOrder = await getFormattedOrderDetails(order, products);
      formattedOrderHistory.push(formattedOrder);
    }

    return res.status(200).json(new ApiResponse(200, formattedOrderHistory, "Order history fetched successfully"));
  } catch (error) {
    console.log("Error while fetching order history:", error);
    return res.status(500).json(new ApiResponse(500, {}, error.message));
  }
}

const makePaymentCustomer = async (req, res) => {
  // Get the orderId from the request body
  // Find the order
  // Find the customer's bank account
  // Check if the bank account has sufficient balance
  //  Find the e-commerce
  // FInd the e-commerce's bank account
  // Create a transaction from customer to e-commerce with the amount and orderId with requestApprovalStatus set to true
  // Decrease the customer's bank account balance
  // Increase the e-commerce's bank account balance
  // Update the order.inCart to false

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get the orderId from the request body
    const { orderId, accountSecret } = req.body;
    if (!orderId) {
      throw new ApiError(400, "Order id is required");
    } else if (!accountSecret) {
      throw new ApiError(400, "Account secret is required");
    }


    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    const amount = order.amount;

    // Find the customer's bank account
    const customerBankAccount = await BankAccount.findOne({ accountNo: req.user.accountNo });

    if (!customerBankAccount) {
      throw new ApiError(404, "Bank account not found");
    }

    // Check if the accountSecret is correct
    const isAccountSecretCorrect = await customerBankAccount.isAccountSecretCorrect(accountSecret);
    if (!isAccountSecretCorrect) {
      throw new ApiError(400, "Invalid credentials");
    }

    // Check if the bank account has sufficient balance
    if (customerBankAccount.balance < amount) {
      throw new ApiError(400, "Insufficient balance");
    }

    //  Find the e-commerce
    const eCommerce = await User.findOne({ role: USER_ROLES.eCommerce });

    if (!eCommerce) {
      throw new ApiError(404, "E-commerce not found");
    }

    // Find the e-commerce's bank account
    const eCommerceBankAccount = await BankAccount.findOne({ accountNo: eCommerce.accountNo });

    if (!eCommerceBankAccount) {
      throw new ApiError(404, "E-commerce bank account not found");
    }

    // Check if a transaction already exists
    const existingTransaction = await Transaction.findOne({ from: customerBankAccount.accountNo, to: eCommerceBankAccount.accountNo, orderId: orderId });

    if (existingTransaction) {
      throw new ApiError(400, "Transaction already exists");
    }


    // Create a transaction from customer to e-commerce with the amount and orderId
    const transaction = await Transaction.create([{
      from: customerBankAccount.accountNo,
      to: eCommerceBankAccount.accountNo,
      orderId: orderId,
      amount: amount,
      requestApprovalStatus: true
    }], { session: session });

    if (!transaction) {
      throw new ApiError(400, "Unable to make payment");
    }

    // Decrease the customer's bank account balance
    customerBankAccount.balance -= amount;
    const updatedCustomerBankAccount = await customerBankAccount.save({ new: true, session: session });

    if (!updatedCustomerBankAccount) {
      throw new ApiError(400, "Unable to update customer's bank account");
    }

    // Increase the e-commerce's bank account balance
    eCommerceBankAccount.balance += amount;
    const updatedECommerceBankAccount = await eCommerceBankAccount.save({ new: true, session: session });

    if (!updatedECommerceBankAccount) {
      throw new ApiError(400, "Unable to update e-commerce's bank account");
    }

    // Update the order.inCart to false
    order.inCart = false;
    const updatedOrder = await order.save({ new: true, session: session });

    if (!updatedOrder) {
      throw new ApiError(400, "Unable to update order");
    }

    if (session.inTransaction()) {
      await session.commitTransaction();
    } else {
      throw new ApiError(400, "Session has already been aborted");
    }
    return res.status(200).json(new ApiResponse(200, transaction[0], "Payment successful"));
  } catch (error) {
    console.log("Error while making payment:", error);
    session.abortTransaction();
    return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, {}, error.message));
  } finally {
    session.endSession();
  }
}

export { addToCart, getCart, makePaymentCustomer, getOrderHistory };