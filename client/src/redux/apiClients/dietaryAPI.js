import { createAsyncThunk } from "@reduxjs/toolkit";
import { displayErrorToast } from "../../utils/toastUtil";
import axios from "axios";
import { getAuthConfig } from "../../utils/authHeaders";

// Fetch all dietary options
export const fetchDietaryOptions = createAsyncThunk(
  "dietary/fetchDietaryOptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API}/preferences/dietary-options`,
        getAuthConfig()
      );
      return response.data.dietaryOptions;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response.data);
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
      return response.data.dietaryOption;
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
      await axios.delete(`/dietary-options/${id}`, getAuthConfig());
      return id;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response.data);
    }
  }
);
