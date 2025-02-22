import { model, Schema } from "mongoose";
import { BANK_ACCOUNT_MODEL } from "../constants.js";
import bcrypt from "bcryptjs";

const bankAccountSchema = new Schema({
  accountName: {
    type: String
  },
  accountNo: {
    type: String,
    required: [true, "An account must have an account number"],
    unique: true,
    index: true
  },
  accountSecret: {
    type: String,
    required: [true, "An account must have a secret key"]
  },
  balance: {
    type: Number,
    required: [true, "An account must have a balance"],
    min: [0, "Balance cannot be negative"]
  }
}, { timestamps: true });

bankAccountSchema.pre("save", function (next) {
  if (!this.isModified("accountSecret")) {
    return next();
  }

  this.accountSecret = bcrypt.hashSync(this.accountSecret, 10);
  next();
});

bankAccountSchema.methods.isAccountSecretCorrect = async function (accountSecret) {
  return await bcrypt.compare(accountSecret, this.accountSecret)
}

export const BankAccount = model(BANK_ACCOUNT_MODEL, bankAccountSchema);