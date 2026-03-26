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
    loading: false,
    error: null,
    pagination: null,

    dietary: null,
    dietaryLoading: false,
    dietaryError: null,
  },
  reducers: {
    setDietary(state, action) {
      state.dietary = action.payload;
    },
    clearDietary(state, action) {
      state.dietary = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDietaryOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDietaryOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.dietaryOptions = action.payload.dietaryOptions;
        state.pagination = action.payload.pagination;
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
      .addCase(addDietaryOption.pending, (state) => {
        state.dietaryLoading = true;
      })
      .addCase(addDietaryOption.fulfilled, (state, action) => {
        state.dietaryLoading = false;
        state.dietaryOptions.push(action.payload);
      })
      .addCase(addDietaryOption.rejected, (state, action) => {
        state.dietaryLoading = false;
        state.dietaryError = action.payload;
      })
      .addCase(updateDietaryOption.pending, (state) => {
        state.dietaryLoading = true;
      })
      .addCase(updateDietaryOption.fulfilled, (state, action) => {
        state.dietaryLoading = false;
        const index = state.dietaryOptions.findIndex(
          (option) => option.id === action.payload.id
        );
        if (index !== -1) {
          state.dietaryOptions[index] = action.payload;
        }
      })
      .addCase(updateDietaryOption.rejected, (state) => {
        state.dietaryLoading = false;
      })
      .addCase(deleteDietaryOption.pending, (state) => {
        state.dietaryLoading = true;
      })
      .addCase(deleteDietaryOption.fulfilled, (state, action) => {
        state.dietaryLoading = false;
        state.dietaryOptions = state.dietaryOptions.filter(
          (option) => option.id !== action.payload.id
        );
      })
      .addCase(deleteDietaryOption.rejected, (state, action) => {
        state.dietaryLoading = false;
        state.dietaryError = action.payload;
      });
  },
});
export const { setDietary, clearDietary } = dietarySlice.actions;
export default dietarySlice.reducer;
