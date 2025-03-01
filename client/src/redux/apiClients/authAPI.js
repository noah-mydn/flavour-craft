import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { displayErrorToast } from "../../utils/toastUtil";
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

      return { user, accessToken, refreshToken };
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error);
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

      return { user, accessToken, refreshToken };
    } catch (error) {
      console.log(error?.response?.data.message);
      if (error?.response?.data.message) {
        const errorMsg = error.response.data.message || error.message;
        return rejectWithValue(errorMsg);
      }
      //return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const googleAuth = createAsyncThunk(
  "auth/googleAuth",
  async (googleResponse, { rejectWithValue }) => {
    try {
      const { access_token } = googleResponse;

      const response = await axios.get("/auth/google", {
        token: access_token,
      });

      const { user, accessToken, refreshToken } = response.data;

      sessionStorage.setItem("userData", JSON.stringify(user));
      sessionStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      console.log("User authenticated successfully:", user);
    } catch (error) {
      console.error("Error during Google authentication:", error.message);
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
