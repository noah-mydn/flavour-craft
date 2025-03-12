import { createSlice } from "@reduxjs/toolkit";
import {
  addDietaryOption,
  deleteDietaryOption,
  fetchDietaryOptionById,
  fetchDietaryOptions,
  updateDietaryOption,
} from "../apiClients/dietaryAPI";

const dietarySlice = createSlice({
  name: "dietary",
  initialState: {
    dietaryOptions: [],
    selectedDietaryOption: "",
    dietaryOptionLoading: false,
    dietaryError: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDietaryOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDietaryOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.dietaryOptions = action.payload;
      })
      .addCase(fetchDietaryOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDietaryOptionById.pending, (state) => {
        state.dietaryOptionLoading = true;
        state.dietaryError = null;
      })
      .addCase(fetchDietaryOptionById.fulfilled, (state, action) => {
        state.dietaryOptionLoading = false;
        state.selectedDietaryOption = action.payload;
      })
      .addCase(fetchDietaryOptionById.rejected, (state, action) => {
        state.dietaryOptionLoading = false;
        state.dietaryError = action.payload;
      })
      .addCase(addDietaryOption.fulfilled, (state, action) => {
        state.dietaryOptions.push(action.payload);
      })
      .addCase(updateDietaryOption.fulfilled, (state, action) => {
        const index = state.dietaryOptions.findIndex(
          (option) => option.id === action.payload.id
        );
        if (index !== -1) {
          state.dietaryOptions[index] = action.payload;
        }
      })
      .addCase(deleteDietaryOption.fulfilled, (state, action) => {
        state.dietaryOptions = state.dietaryOptions.filter(
          (option) => option.id !== action.payload.id
        );
      })
      .addCase(deleteDietaryOption.rejected, (state, action) => {
        state.dietaryError = action.payload;
      });
  },
});

export default dietarySlice.reducer;
