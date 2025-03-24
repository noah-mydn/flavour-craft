import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  displayErrorToast,
  displayInfoToast,
  displaySuccessToast,
} from "../../utils/toastUtil";
import axios from "axios";
import { getAuthConfig } from "../../utils/authHeaders";

// Fetch all dietary options
export const fetchCuisines = createAsyncThunk(
  "cuisine/fetchCuisines",
  async ({ page, pageSize }, { rejectWithValue }) => {
    const BASE_API = process.env.REACT_APP_BASE_API;
    const API_URL =
      page && pageSize
        ? `${BASE_API}/preferences/cuisines?page=${page}&pageSize=${pageSize}`
        : `${BASE_API}/preferences/cuisines`;
    console.log("IT RUNS:", API_URL);
    try {
      const response = await axios.get(API_URL, getAuthConfig());
      return response.data;
    } catch (error) {
      displayErrorToast(error);

      console.log("CUISINES FETCHING ERROR:", error);
      return rejectWithValue(
        error.response?.data || "An unexpected error occurred"
      );
    }
  }
);

//Get By Id
export const fetchCuisineById = createAsyncThunk(
  "cuisine/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API}/preferences/cuisines/${id}`,
        getAuthConfig()
      );
      return response.data.cuisine;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add a dietary option
export const addCuisine = createAsyncThunk(
  "cuisine/addCuisine",
  async (newDietary, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API}/preferences/cuisines`,
        newDietary,
        getAuthConfig()
      );
      displaySuccessToast(
        "New cuisine type added: ",
        response.data.cuisineType?.name
      );
      return response.data.cuisineType;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response.data);
    }
  }
);

// Update a dietary option
export const updateCuisine = createAsyncThunk(
  "cuisine/updateCuisine",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_API}/preferences/cuisines/${id}`,
        { name },
        getAuthConfig()
      );
      displaySuccessToast(
        "Cuisine updated!: ",
        response.data.updatedCuisine?.name
      );

      //console.log(response.data);
      return response.data.updatedCuisine;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a dietary option
export const deleteCuisine = createAsyncThunk(
  "cuisine/deleteCuisine",
  async ({ id }, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_API}/preferences/cuisines/${id}`,
        getAuthConfig()
      );
      displayInfoToast("Cuisine type deleted!");
      return id;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response.data);
    }
  }
);
