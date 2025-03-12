// In your API client file (userAPI.js or similar)
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthConfig } from "../../utils/authHeaders";
import { displayErrorToast, displaySuccessToast } from "../../utils/toastUtil";

export const getCurrentUserProfile = createAsyncThunk(
  "userProfile/getCurrentUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API}/user/me`,
        getAuthConfig()
      );

      console.log("User Profile:", response.data.user);

      sessionStorage.setItem("userData", JSON.stringify(response.data.user));

      return response.data.user;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(
        error.response?.data || "Error fetching user profile"
      );
    }
  }
);

export const toggleSavedRecipe = createAsyncThunk(
  "userProfile/toggleSavedRecipe",
  async (recipeId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API}/recipes/${recipeId}/save`,
        {},
        getAuthConfig()
      );
      getCurrentUserProfile();
      displaySuccessToast(response.data.message);
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response?.data || "Error saving recipe");
    }
  }
);
