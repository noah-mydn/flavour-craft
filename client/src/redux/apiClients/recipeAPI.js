import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { displayErrorToast } from "../../utils/toastUtil";
import { getAuthConfig } from "../../utils/authHeaders";

const BASE_URL = process.env.REACT_APP_BASE_API + "/recipes";

// Fetch All Recipes
export const fetchAllRecipes = createAsyncThunk(
  "recipes/fetchAllRecipes",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/all`,
        payload,
        getAuthConfig()
      );
      const { recipes, pagination } = response.data;
      console.log(response.data);
      return { recipes, pagination };
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response?.data || "Error fetching recipes");
    }
  }
);
