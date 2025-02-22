import { model, Schema } from "mongoose";
import { BANK_ACCOUNT_MODEL, ORDER_MODEL, TRANSACTION_MODEL } from "../constants.js";

const transactionSchema = new Schema({
  from: {
    type: String,
    required: [true, "Transaction must have a from account"],
    trim: true,
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: 'From account cannot be empty'
    }
  },
  to: {
    type: String,
    required: [true, "Transaction must have a to account"],
    trim: true,
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: 'From account cannot be empty'
    }
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: ORDER_MODEL,
    required: [true, "Transaction must have an order id"]
  },
  amount: {
    type: Number,
    required: [true, "Transaction must have an amount"],
    min: [0, "Amount cannot be negative"]
  },
  requestApprovalStatus: {
    type: Boolean,
    default: false
  },
  at: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const Transaction = model(TRANSACTION_MODEL, transactionSchema);