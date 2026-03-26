import { createSlice } from "@reduxjs/toolkit";
import {
  addCuisine,
  deleteCuisine,
  fetchCuisineById,
  fetchCuisines,
  updateCuisine,
} from "../apiClients/cuisineAPI";

const cuisineSlice = createSlice({
  name: "cuisine",
  initialState: {
    cuisines: [],
    loading: false,
    error: null,
    pagination: null,

    cuisine: null,
    cuisineLoading: false,
    cuisineError: null,
  },
  reducers: {
    setCuisine(state, action) {
      state.cuisine = action.payload;
    },
    clearCuisine(state, action) {
      state.cuisine = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCuisines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCuisines.fulfilled, (state, action) => {
        state.loading = false;
        state.cuisines = action.payload.cuisines;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCuisines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Rejected payload:", action);
      })
      .addCase(fetchCuisineById.pending, (state) => {
        state.cuisineLoading = true;
        state.cuisineError = null;
      })
      .addCase(fetchCuisineById.fulfilled, (state, action) => {
        state.cuisineLoading = false;
        state.cuisine = action.payload;
      })
      .addCase(fetchCuisineById.rejected, (state, action) => {
        state.cuisineLoading = false;
        state.cuisineError = action.payload;
      })
      .addCase(addCuisine.pending, (state) => {
        state.cuisineLoading = true;
      })
      .addCase(addCuisine.fulfilled, (state, action) => {
        state.cuisineLoading = false;
        state.cuisines.push(action.payload);
      })
      .addCase(addCuisine.rejected, (state, action) => {
        state.cuisineLoading = false;
        state.cuisineError = action.payload;
      })
      .addCase(updateCuisine.pending, (state) => {
        state.cuisineLoading = true;
      })
      .addCase(updateCuisine.fulfilled, (state, action) => {
        console.log("INSIDE SLICE:", action.payload);
        state.cuisineLoading = false;
        const index = state.cuisines.findIndex(
          (cuisine) => cuisine._id === action.payload._id
        );
        if (index !== -1) {
          state.cuisines[index] = action.payload;
        }
      })
      .addCase(updateCuisine.rejected, (state, action) => {
        state.cuisineLoading = false;
        state.cuisineError = action.payload;
      })
      .addCase(deleteCuisine.pending, (state) => {
        state.cuisineLoading = true;
      })
      .addCase(deleteCuisine.fulfilled, (state, action) => {
        state.cuisineLoading = false;
        state.cuisines = state.cuisines.filter(
          (cuisine) => cuisine.id !== action.payload.id
        );
      })
      .addCase(deleteCuisine.rejected, (state, action) => {
        state.cuisineLoading = false;
        state.cuisineError = action.payload;
      });
  },
});

export const { setCuisine, clearCuisine } = cuisineSlice.actions;

export default cuisineSlice.reducer;
