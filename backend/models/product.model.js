import { model, Schema } from "mongoose";
import { PRODUCT_MODEL } from "../constants.js";

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    unique: true
  },
  imageUrl: {
    type: String,
    required: [true, "Product image is required"],
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price cannot be negative"],
  },
}, { timestamps: true });

export const Product = model(PRODUCT_MODEL, productSchema);