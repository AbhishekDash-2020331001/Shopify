import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BANK_MODEL, USER_ROLES } from "../constants.js";

const bankSchema = new Schema({
  name: {
    type: String,
    required: [true, "Bank name is required"],
  },
  email: {
    type: String,
    required: [true, "Bank email is required"],
    trim: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: [true, "Bank password is required"],
  },
  role: {
    type: String,
    enum: [USER_ROLES.bank],
    default: USER_ROLES.bank
  }
}, { timestamps: true });

bankSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

bankSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

bankSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}
bankSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

export const Bank = model(BANK_MODEL, bankSchema);