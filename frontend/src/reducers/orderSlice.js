import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axios } from "../utils/axiosInstance";
import { formattedError } from "../utils/formattedError";

const getCart = createAsyncThunk("order/getCart", async (_, { rejectWithValue }) => {
  // Use axios and try catch
  try {
    const response = await axios.get("/customer/cart");
    return response.data.data;
  } catch (error) {
    console.log("Error while getting cart:", error);
    const err = formattedError(error);
    return rejectWithValue(err);
  }
});

const addToCart = createAsyncThunk("order/addToCart", async ({ productId, quantity }, { rejectWithValue }) => {
  // Use axios and try catch
  try {
    const response = await axios.post("/customer/add-to-cart", { productId, quantity });
    return response.data.data;
  } catch (error) {
    console.log("Error while adding to cart:", error);
    const err = formattedError(error);
    return rejectWithValue(err);
  }
});

const makePayment = createAsyncThunk("order/makePayment", async ({ orderId, accountSecret }, { rejectWithValue }) => {
  // Use axios and try catch
  try {
    const response = await axios.post("/customer/payment", { orderId, accountSecret });
    return response.data.data;
  } catch (error) {
    console.log("Error while making payment:", error);
    const err = formattedError(error);
    return rejectWithValue(err);
  }
})

const orderSlice = createSlice({
  name: "order",
  initialState: {
    cart: {
      products: {},
    },
    transaction: {},
    loading: false,
    error: null,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.transaction = {};
        state.error = null;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });


    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.error.message;
        state.error = action.payload;
      });

    builder
      .addCase(makePayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(makePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.transaction = action.payload;
      })
      .addCase(makePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const orderReducer = orderSlice.reducer;

export { orderReducer, getCart, addToCart, makePayment };