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
    selectedCuisine: null,
    cuisineLoading: false,
    cuisineError: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCuisines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCuisines.fulfilled, (state, action) => {
        state.loading = false;
        state.cuisines = action.payload;
      })
      .addCase(fetchCuisines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCuisineById.pending, (state) => {
        state.cuisineLoading = true;
        state.cuisineError = null;
      })
      .addCase(fetchCuisineById.fulfilled, (state, action) => {
        state.cuisineLoading = false;
        state.selectedCuisine = action.payload;
      })
      .addCase(fetchCuisineById.rejected, (state, action) => {
        state.cuisineLoading = false;
        state.cuisineError = action.payload;
      })
      .addCase(addCuisine.fulfilled, (state, action) => {
        state.cuisines.push(action.payload);
      })
      .addCase(updateCuisine.fulfilled, (state, action) => {
        const index = state.cuisines.findIndex(
          (cuisine) => cuisine.id === action.payload.id
        );
        if (index !== -1) {
          state.cuisines[index] = action.payload;
        }
      })
      .addCase(deleteCuisine.fulfilled, (state, action) => {
        state.cuisines = state.cuisines.filter(
          (cuisine) => cuisine.id !== action.payload.id
        );
      })
      .addCase(deleteCuisine.rejected, (state, action) => {
        state.cuisineError = action.payload;
      });
  },
});

export default cuisineSlice.reducer;
