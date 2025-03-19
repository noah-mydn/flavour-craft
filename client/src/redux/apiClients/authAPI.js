import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { displayErrorToast } from "../../utils/toastUtil";
import { getAuthConfig } from "../../utils/authHeaders";
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

//Google Auth
export const googleAuth = createAsyncThunk(
  "auth/googleAuth",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API}/auth/google`,
        { token },
        getAuthConfig()
      );
      console.log("Google Auth Response:", response.data);

      sessionStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      sessionStorage.setItem("auth", JSON.stringify(response.data.user));

      return {
        user: response.data.user,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(
        error.response.data || "Error authenticating with Google"
      );
    }
  }
);
