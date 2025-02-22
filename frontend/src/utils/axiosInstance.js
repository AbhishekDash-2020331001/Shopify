import axios from 'axios';
import { store } from '../app/store';
import { logout, refreshAccessToken } from '../reducers/authSlice';

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:8000/api/v1" : "/api/v1",
  withCredentials: true,  // This allows sending cookies with requests
  timeout: 10000,
});

// Add a response interceptor to handle token refreshing on 401 errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // If the error is due to an expired token (401), refresh the token
    // console.log("Interceptor Error:", error);

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Dispatch an action to refresh the token
      try {
        await store.dispatch(refreshAccessToken());
        return axiosInstance(originalRequest);
      } catch (error) {
        console.log("Inside catch in interceptor:", error);
        store.dispatch(logout());
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export { axiosInstance as axios };
