import { createAsyncThunk } from "@reduxjs/toolkit";
import { displayErrorToast } from "../../utils/toastUtil";
import axios from "axios";
import { getAuthConfig } from "../../utils/authHeaders";

// Fetch all dietary options
export const fetchCuisines = createAsyncThunk(
  "dietary/fetchCuisines",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API}/preferences/cuisines`,
        getAuthConfig()
      );
      console.log(response.data.cuisines);
      return response.data.cuisines;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response.data);
    }
  }
);

//Get By Id
export const fetchCuisineById = createAsyncThunk(
  "cuisines/fetchById",
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
  "dietary/addCuisine",
  async (newDietary, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API}/preferences/cuisines`,
        newDietary,
        getAuthConfig()
      );
      return response.data.cuisine;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response.data);
    }
  }
);

// Update a dietary option
export const updateCuisine = createAsyncThunk(
  "dietary/updateCuisine",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_API}/preferences/cuisines/${id}`,
        { name },
        getAuthConfig()
      );
      return response.data.cuisine;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a dietary option
export const deleteCuisine = createAsyncThunk(
  "dietary/deleteCuisine",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_API}/preferences/cuisines/${id}`,
        getAuthConfig()
      );
      return id;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response.data);
    }
  }
);
