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

    // console.log("DATA:", response.data);
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
  async ({ filters, page, pageSize }, { rejectWithValue }) => {
    console.log("Filters:", filters);
    console.log("Page and PageSize:", page, pageSize);
    try {
      const response = await axios.post(
        `${BASE_URL}/filter?page=${page}&pageSize=${pageSize}`,
        filters,
        getAuthConfig()
      );
      //console.log("Filter Response:", response.data);
      return response.data;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response?.data || "Failed to fetch recipes");
    }
  }
);

export const fetchRecipeById = createAsyncThunk(
  "recipes/fetchRecipeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`, getAuthConfig());
      return response.data.recipe;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteRecipe = createAsyncThunk(
  "recipes/deleteRecipe",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${id}`, getAuthConfig());
      console.log("DELETE RESPONSE:", response);
      return response.data;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error);
    }
  }
);

export const searchRecipe = createAsyncThunk(
  "recipes/searchRecipe",
  async ({ query, page, pageSize }, { rejectWithValue }) => {
    console.log("PAGE:", page);
    console.log("PAGE SIZE:", pageSize);
    try {
      let url =
        page && pageSize
          ? `${BASE_URL}/search?page=${page}&pageSize=${pageSize}`
          : `${BASE_URL}/search`;
      const response = await axios.post(url, { query }, getAuthConfig());
      return response.data;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error);
    }
  }
);
