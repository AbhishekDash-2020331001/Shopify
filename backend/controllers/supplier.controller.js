import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/fileUploader.js";
import { USER_ROLES, ORDER_STATUS } from "../constants.js";
import { getFormattedOrderRequests } from "../utils/formattedOrder.js";


const getSupplyRequestsSupplier = async (req, res) => {
  try {
    const orderRequests = await Order.find({ status: ORDER_STATUS.approvedPaid });

    const formattedOrderRequests = await getFormattedOrderRequests(orderRequests);
    return res.status(200).json(new ApiResponse(200, formattedOrderRequests, "Order requests fetched successfully"));
  } catch (error) {
    console.log("Error while fetching e-commerce order requests:", error);
    return res.status(500).json(new ApiResponse(500, {}, error.message));
  }
}

const approveSupplyRequestSupplier = async (req, res) => {

  try {
    const { orderId } = req.body;

    if (!orderId) {
      throw new ApiError(400, "Order id is required");
    }

    const orderRequest = await Order.findById(orderId);

    if (!orderRequest) {
      throw new ApiError(404, "Order request not found");
    }

    orderRequest.status = ORDER_STATUS.shipping;
    const updatedOrderRequest = await orderRequest.save({ new: true });

    if (!updatedOrderRequest) {
      throw new ApiError(400, "Unable to approve order request");
    }

    return res.status(200).json(new ApiResponse(200, updatedOrderRequest, "Order request approved successfully"));
  } catch (error) {
    console.log("Error while approving e-commerce order request:", error);
    return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, {}, error.message));
  }
}
const createProductSupplier = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !description || !price) {
      return res.status(400).json(new ApiResponse(400, {}, "All fields are required"));
    }

    if (isNaN(price)) {
      throw new ApiError(400, "Invalid price");
    }

    const numPrice = Number(price);

    if (!req.file) {
      throw new ApiError(400, "Product image is required");
    }

    const productImage = await uploadOnCloudinary(req.file.path);

    if (!productImage) {
      throw new ApiError(400, "Product image upload failed");
    }

    const product = await Product.create({
      name,
      imageUrl: productImage.url,
      description,
      price: numPrice
    });

    if (!product) {
      throw new ApiError(400, "Unable to create product");
    }

    return res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
  } catch (error) {
    console.log("Error while creating product:", error);
    return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, {}, error.message));
  }
}

export { getSupplyRequestsSupplier, approveSupplyRequestSupplier, createProductSupplier };