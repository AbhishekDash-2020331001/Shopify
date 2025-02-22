import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axios } from '../utils/axiosInstance';
import { persistor } from '../app/store';
import { formattedError } from '../utils/formattedError';


const signup = createAsyncThunk('auth/signup', async ({ name, email, password, role }, { rejectWithValue }) => {
  try {
    const response = await axios.post('/auth/signup', { name, email, password, role });
    return response.data.data;
  } catch (error) {
    console.log("Error while signing up:", error);
    const err = formattedError(error);
    return rejectWithValue(err);
  }
});

const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {

  try {
    const response = await axios.post('/auth/login', { email, password });
    return response.data.data; // Assuming user data is in the 'data' field of the response
  } catch (error) {
    console.log("Error while logging in:", error);
    const err = formattedError(error);
    return rejectWithValue(err);
  }
}
);

const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.post('/auth/logout');
    await persistor.purge();
    return response.data.data; // Assuming user data is in the 'data' field of the response
  } catch (error) {
    console.log("Error while logging out:", error);
    const err = formattedError(error);
    return rejectWithValue(err);
  }
})

const getUser = createAsyncThunk('auth/getUser', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/auth/user');
    return response.data.data; // Assuming user data is in the 'data' field of the response
  } catch (error) {
    console.log("Error while fetching user data:", error);
    const err = formattedError(error);
    return rejectWithValue(err);
  }
});

const refreshAccessToken = createAsyncThunk('auth/refreshAccessToken', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.post('/auth/refresh-access-token');
    return response.data.data; // Assuming user data is in the 'data' field of the response
  } catch (error) {
    console.log("Error while refreshing access token:", error);
    const err = formattedError(error);
    return rejectWithValue(err);
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Signup user
    builder.addCase(signup.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Login user
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Logout user
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get user
    builder.addCase(getUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Refresh access token
    builder.addCase(refreshAccessToken.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(refreshAccessToken.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(refreshAccessToken.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});
const authReducer = authSlice.reducer;

export { authReducer, signup, login, logout, getUser, refreshAccessToken };