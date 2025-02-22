import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Bank } from "../models/bank.model.js";
import { ACCESS_TOKEN, NODE_ENVIRONMENTS, REFRESH_TOKEN, USER_ROLES } from "../constants.js";
import { redisClient } from "../utils/redisClient.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId, res) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      const bank = await Bank.findById(userId);
      if (!bank) {
        return { undefined, undefined }
      }
      const accessToken = await bank.generateAccessToken();
      const refreshToken = await bank.generateRefreshToken();

      return { accessToken, refreshToken }
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    return { accessToken, refreshToken }
  } catch (error) {
    console.log("Error while generating tokens:", error);
    return res.status(500).json(new ApiResponse(500, {}, error.message));
  }
}

const setToken = (tokenKey, token, tokenExpiresAt, res) => {
  res.cookie(tokenKey, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === NODE_ENVIRONMENTS.production,
    sameSite: "strict",
    maxAge: tokenExpiresAt,
  });
}

const signup = async (req, res) => {
  try {
    if (req[REFRESH_TOKEN]) {
      throw new ApiError(400, "User already logged in");
    }

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    if (role === USER_ROLES.bank) {
      return bankSignUp(req, res);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }

    // If the user's role is e-commerce or supplier check if their already exists a e-commerce or a supplier
    if (role === USER_ROLES.eCommerce || role === USER_ROLES.supplier) {
      const existingUser = await User.findOne({ role });
      if (existingUser) {
        if (role === USER_ROLES.eCommerce) {
          throw new ApiError(400, "E-Commerce already exists");
        } else {
          throw new ApiError(400, "Supplier already exists");
        }

      }
    }

    const user = await User.create({
      name,
      email,
      role: role || USER_ROLES.customer,
      password
    });

    if (!user) {
      throw new ApiError(400, "Unable to create user");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id, res);

    if (!accessToken || !refreshToken) {
      throw new ApiError(500, "Error while generating tokens");
    }

    setToken(ACCESS_TOKEN, accessToken, 1000 * 60 * 15, res);
    setToken(REFRESH_TOKEN, refreshToken, 1000 * 60 * 60 * 24 * 7, res);

    try {
      await redisClient.set(`${REFRESH_TOKEN}_${user._id}`, refreshToken, "EX", 60 * 60 * 24 * 7); // 7 days
    } catch (error) {
      console.log("Error while setting tokens in redis:", error);
      throw new ApiError(500, error.message);
    }

    user.password = undefined;
    req.user = user;

    return res.status(201).json(new ApiResponse(201, user, "User Created Successfully"));
  } catch (error) {
    console.log("Error while signing up:", error);
    return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, {}, error.message));
  }
}

const bankSignUp = async (req, res) => {
  try {
    const existingBank = await Bank.findOne({});
    if (existingBank) {
      throw new ApiError(400, "Bank already exists");
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const bank = await Bank.create({
      name,
      email,
      password,
      role: USER_ROLES.bank,
    });

    if (!bank) {
      throw new ApiError(400, "Unable to create bank");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(bank._id, res);

    if (!accessToken || !refreshToken) {
      throw new ApiError(500, "Error while generating tokens");
    }

    setToken(ACCESS_TOKEN, accessToken, 1000 * 60 * 15, res);
    setToken(REFRESH_TOKEN, refreshToken, 1000 * 60 * 60 * 24 * 7, res);

    try {
      await redisClient.set(`${REFRESH_TOKEN}_${bank._id}`, refreshToken, "EX", 60 * 60 * 24 * 7); // 7 days
    } catch (error) {
      console.log("Error while setting tokens in redis:", error);
      throw new ApiError(500, error.message);
    }

    bank.password = undefined;
    req.user = bank;

    return res.status(201).json(new ApiResponse(201, bank, "Bank Created Successfully"));
  } catch (error) {
    console.log("Error while signing up bank:", error);
    return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, {}, error.message));
  }
}

const login = async (req, res) => {

  try {
    if (req[REFRESH_TOKEN]) {
      throw new ApiError(400, "User already logged in");
    }

    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      const bank = await Bank.findOne({ email });
      if (!bank) {
        return res.status(400).json(new ApiResponse(400, {}, "Invalid email"));
      }

      const isPasswordCorrect = await bank.isPasswordCorrect(password);
      if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid password");
      }

      const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(bank._id, res);

      if (!accessToken || !refreshToken) {
        throw new ApiError(500, "Error while generating tokens");
      }
      setToken(ACCESS_TOKEN, accessToken, 1000 * 60 * 15, res);
      setToken(REFRESH_TOKEN, refreshToken, 1000 * 60 * 60 * 24 * 7, res);

      try {
        await redisClient.set(`${REFRESH_TOKEN}_${bank._id}`, refreshToken, "EX", 60 * 60 * 24 * 7); // 7 days
      } catch (error) {
        console.log("Error while setting tokens in redis:", error);
        throw new ApiError(500, "Error while setting tokens in redis", error.message);
      }

      bank.password = undefined;

      req.user = bank;

      return res.status(200).json(new ApiResponse(200, bank, "Login Successful"));
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(400, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id, res);

    if (!accessToken || !refreshToken) {
      throw new ApiError(500, "Error while generating tokens");
    }

    setToken(ACCESS_TOKEN, accessToken, 1000 * 60 * 15, res);
    setToken(REFRESH_TOKEN, refreshToken, 1000 * 60 * 60 * 24 * 7, res);

    try {
      await redisClient.set(`${REFRESH_TOKEN}_${user._id}`, refreshToken, "EX", 60 * 60 * 24 * 7); // 7 days
    } catch (error) {
      console.log("Error while setting tokens in redis:", error);
      throw new ApiError(500, "Error while setting tokens in redis", error.message)
    }

    user.password = undefined;

    req.user = user;

    return res.status(200).json(new ApiResponse(200, user, "Login Successful"));
  } catch (error) {
    console.log("Error while logging in:", error);
    return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, {}, error.message));
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie(ACCESS_TOKEN);
    res.clearCookie(REFRESH_TOKEN);
    req.user = undefined;
    return res.status(200).json(new ApiResponse(200, {}, "Logout Successful"));
  } catch (error) {
    console.log("Error while logging out:", error);
    return res.status(500).json(new ApiResponse(500, {}, error.message));
  }
}

const logoutFromAllDevices = async (req, res) => {
  try {
    await redisClient.del(`${REFRESH_TOKEN}_${req.user._id}`);
    res.clearCookie(ACCESS_TOKEN);
    res.clearCookie(REFRESH_TOKEN);
    req.user = undefined;
    return res.status(200).json(new ApiResponse(200, {}, "Logout Successful"));
  } catch (error) {
    console.log("Error while logging out:", error);
    return res.status(500).json(new ApiResponse(500, {}, error.message));
  }
}

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
  } catch (error) {
    console.log("Error while fetching user:", error);
    res.status(500).json(new ApiResponse(500, {}, error.message));
  }
}

const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies[REFRESH_TOKEN];
    if (!refreshToken) {
      throw new ApiError(404, "Refresh token not found");
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const redisRefreshToken = await redisClient.get(`${REFRESH_TOKEN}_${decoded._id}`);
    if (!redisRefreshToken) {
      throw new ApiError(401, "Refresh token is invalid or expired");
    }
    const user = await User.findById(decoded._id);
    if (!user) {
      const bank = await Bank.findById(decoded._id);
      if (!bank) {
        throw new ApiError(401, "Invalid refresh token");
      }
      const accessToken = await bank.generateAccessToken();
      setToken(ACCESS_TOKEN, accessToken, 1000 * 60 * 15, res);

      return res.status(200).json(new ApiResponse(200, {}, "Access token refreshed"));
    }

    const accessToken = await user.generateAccessToken();
    setToken(ACCESS_TOKEN, accessToken, 1000 * 60 * 15, res);

    return res.status(200).json(new ApiResponse(200, {}, "Access token refreshed"));
  } catch (error) {
    console.log("Error while refreshing access token:", error);
    return res.status(error?.statusCode || 500).json(new ApiResponse(error?.statusCode || 500, {}, error.message));
  }
}

export { signup, login, logout, logoutFromAllDevices, getUser, refreshAccessToken };