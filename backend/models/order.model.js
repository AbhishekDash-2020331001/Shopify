import { model, Schema } from "mongoose";
import { ORDER_MODEL, USER_MODEL, ORDER_STATUS, PRODUCT_MODEL } from "../constants.js";

const orderSchema = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: USER_MODEL,
    required: true
  },
  products: {
    type: Map,
    of: Number,
    required: [true, "Cart must have at least one product"]
  },
  amount: {
    type: Number,
    required: [true, "Order must have an amount"],
    min: [0, "Amount cannot be negative"]
  },
  inCart: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ORDER_STATUS,
    default: ORDER_STATUS.pending,
  }
}, { timestamps: true });

export const Order = model(ORDER_MODEL, orderSchema);