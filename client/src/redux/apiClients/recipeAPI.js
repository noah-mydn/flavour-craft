// recipeAPI.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthConfig } from "../../utils/authHeaders";
import { displayErrorToast } from "../../utils/toastUtil";

const BASE_URL = process.env.REACT_APP_BASE_API + "/recipes";

export const fetchSortedRecipes = async (sortValue, page, pageSize = 10) => {
  console.log("Sort Value:", sortValue);
  try {
    const response = await axios.get(`${BASE_URL}/${sortValue}`, {
      params: {
        page: page,
        pageSize: pageSize,
      },
      ...getAuthConfig(),
    });

    console.log("DATA:", response.data);
    return response.data;
  } catch (error) {
    displayErrorToast(error);
    throw error.response ? error.response.data.message : error.message;
  }
};

export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async ({ sortValue, page, pageSize }, { rejectWithValue }) => {
    try {
      const data = await fetchSortedRecipes(sortValue, page, pageSize);
      return { data, sortValue };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchFilteredRecipes = createAsyncThunk(
  "recipes/fetchFilteredRecipes",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/filter`, filters);
      console.log("Filter Response:", response);
      return response.data;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response?.data || "Failed to fetch recipes");
    }
  }
);
