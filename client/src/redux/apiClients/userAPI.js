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

      displaySuccessToast(response.data.message);
      return response.data;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response?.data || "Error saving recipe");
    }
  }
);

export const setDietaryPreferences = createAsyncThunk(
  "userProfile/setDietaryPreferences",
  async ({ dietaryOptions }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_API}/user/set/dietaryOptions`,
        { dietaryOptions: dietaryOptions },
        getAuthConfig()
      );
      return response.data.data;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(
        error.response?.data || "Error setting dietary preferences"
      );
    }
  }
);

export const setCuisinePreferences = createAsyncThunk(
  "userProfile/setCuisinePreferences",
  async ({ cuisineTypes }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_API}/user/set/cuisineTypes`,
        { cuisineTypes: cuisineTypes },
        getAuthConfig()
      );
      return response.data.data;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(
        error.response?.data || "Error setting dietary preferences"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "userProfile/updateUserProfile",
  async (payload, { rejectWithValue }) => {
    console.log("Payload is:", payload);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_API}/user/edit`,
        payload,
        getAuthConfig(true)
      );
      displaySuccessToast(response.data.message);
      return response.data.user;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(
        error.response?.data || "Error updating user profile"
      );
    }
  }
);
