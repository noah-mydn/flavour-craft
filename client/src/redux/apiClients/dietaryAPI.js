import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  displayErrorToast,
  displayInfoToast,
  displaySuccessToast,
} from "../../utils/toastUtil";
import axios from "axios";
import { getAuthConfig } from "../../utils/authHeaders";

// Fetch all dietary options
export const fetchDietaryOptions = createAsyncThunk(
  "dietary/fetchDietaryOptions",
  async ({ page, pageSize } = {}, { rejectWithValue }) => {
    const BASE_API = process.env.REACT_APP_BASE_API;
    const API_URL =
      page !== undefined && pageSize !== undefined
        ? `${BASE_API}/preferences/dietary-options?page=${page}&pageSize=${pageSize}`
        : `${BASE_API}/preferences/dietary-options`;

    console.log("IT RUNS:", API_URL);
    try {
      const response = await axios.get(API_URL, getAuthConfig());
      return response.data;
    } catch (error) {
      displayErrorToast(error);
      console.log("DIETARY FETCHING ERROR:", error);
      return rejectWithValue(
        error.response?.data || "An unexpected error occurred"
      );
    }
  }
);

//Get By Id
export const fetchDietaryOptionById = createAsyncThunk(
  "dietary/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API}/preferences/dietary-options/${id}, getAuthConfig()`
      );
      return response.data.dietaryOption;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add a dietary option
export const addDietaryOption = createAsyncThunk(
  "dietary/addDietaryOption",
  async (newDietary, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API}/preferences/dietary-options`,
        newDietary,
        getAuthConfig()
      );
      displaySuccessToast(
        "New dietary option added: ",
        response.data.dietaryOption?.name
      );
      //console.log(response.data);
      return response.data.dietaryOption;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response.data);
    }
  }
);

// Update a dietary option
export const updateDietaryOption = createAsyncThunk(
  "dietary/updateDietaryOption",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_API}/preferences/dietary-options/${id}`,
        { name },
        getAuthConfig()
      );
      displaySuccessToast(
        "Dietary Option Updated: ",
        response.data.updatedDietary?.name
      );
      return response.data.updatedDietary;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a dietary option
export const deleteDietaryOption = createAsyncThunk(
  "dietary/deleteDietaryOption",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_API}/preferences/dietary-options/${id}`,
        getAuthConfig()
      );
      displayInfoToast("Dietary Option deleted!");
      return id;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response.data);
    }
  }
);
