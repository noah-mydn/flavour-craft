import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_API + "/auth";

// Login
export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email: payload.email,
        password: payload.password,
      });
      console.log(response);
      const { user, accessToken, refreshToken } = response.data;

      // Store tokens in appropriate storages
      sessionStorage.setItem("userData", JSON.stringify(user));
      sessionStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      return { user, accessToken };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Refresh Token
export const refreshSession = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await axios.post(`${BASE_URL}/refresh-session`, {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      sessionStorage.setItem("accessToken", accessToken);
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      return accessToken;
    } catch (error) {
      const statusCode = error.response?.status;

      // Handle specific status codes
      if (statusCode === 401) {
        //token expired case
        console.error("Refresh token expired. Logging out...");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("userData");

        return rejectWithValue("Session expired. Please log in again.");
      } else if (statusCode === 403) {
        // Refresh token mismatch or unauthorized
        console.error("Forbidden request.");
        return rejectWithValue("Unauthorized. Please log in again.");
      } else if (statusCode === 404) {
        // User not found
        console.error("User not found.");
        return rejectWithValue("User not found. Please contact support.");
      } else if (statusCode >= 500) {
        // Server error
        console.error("Server error. Please try again later.");
        return rejectWithValue("Server error. Please try again later.");
      }

      // Default fallback for unexpected errors
      console.error("An unknown error occurred:", error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//Register
export const register = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: payload.password,
      });
      const { user, accessToken, refreshToken } = response.data;

      // Store tokens in appropriate storages
      sessionStorage.setItem("userData", JSON.stringify(user));
      sessionStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      return { user, accessToken };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
