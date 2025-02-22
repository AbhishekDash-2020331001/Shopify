import { User } from "../models/user.model.js";
import { Bank } from "../models/bank.model.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_ROLES } from "../constants.js";
import { redisClient } from "../utils/redisClient.js";

const verifyJWT = async (req, res, next) => {
  try {
    const accessToken = req.cookies[ACCESS_TOKEN] || req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken) {
      throw new ApiError(401, "Unauthorized: Access token not found");
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    const redisRefreshToken = await redisClient.get(`${REFRESH_TOKEN}_${decoded._id}`);

    if (!redisRefreshToken) {
      throw new ApiError(401, "Unauthorized: Invalid access token");
    }

    const verifiedUser = await User.findById(decoded._id);
    if (!verifiedUser) {
      const verifiedBank = await Bank.findById(decoded._id);
      if (!verifiedBank) {
        throw new ApiError(401, "Invalid access token: User not found");
      }
      verifiedBank.password = undefined;
      req.user = verifiedBank;
      next();
      return;
    }

    verifiedUser.password = undefined;
    req.user = verifiedUser;
    next();
  } catch (error) {
    console.log("Error while verifying JWT:", error);
    return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, {}, error.message));
  }
}

const bankRoute = (req, res, next) => {
  
  if (req.user.role !== USER_ROLES.bank) {
    return res.status(403).json(new ApiResponse(403, {}, "Forbidden"));
  }
  next();
}

const supplierRoute = (req, res, next) => {
  if (req.user.role !== USER_ROLES.supplier) {
    return res.status(403).json(new ApiResponse(403, {}, "Forbidden"));
  }
  next();
}

const eCommerceRoute = (req, res, next) => {
  if (req.user.role !== USER_ROLES.eCommerce) {
    return res.status(403).json(new ApiResponse(403, {}, "Forbidden"));
  }
  next();
}

const customerRoute = (req, res, next) => {
  if (req.user.role !== USER_ROLES.customer) {
    return res.status(403).json(new ApiResponse(403, {}, "Forbidden"));
  }
  next();
}

const userRoute = (req, res, next) => {
  if (req.user.role !== USER_ROLES.customer && req.user.role !== USER_ROLES.eCommerce && req.user.role !== USER_ROLES.supplier) {
    return res.status(403).json(new ApiResponse(403, {}, "Forbidden"));
  }
  next();
}

export { verifyJWT, bankRoute, supplierRoute, eCommerceRoute, customerRoute, userRoute };