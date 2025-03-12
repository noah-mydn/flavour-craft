import { createSlice } from "@reduxjs/toolkit";
import {
  getCurrentUserProfile,
  toggleSavedRecipe,
} from "../apiClients/userAPI";

const initialState = {
  profile: null,
  isLoading: false,
  error: null,
  status: "",
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateCuisinePreferences: (state, action) => {
      state.cuisinePreferences = action.payload;
      const storedUserData = sessionStorage.getItem("userData");
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        userData.cuisinePreferences = state.cuisinePreferences;
        sessionStorage.setItem("userData", JSON.stringify(userData));
      }
    },
    updateDietaryRestrictions: (state, action) => {
      state.dietaryRestrictions = action.payload;
    },
    clearUserProfile: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(getCurrentUserProfile.rejected, (state, action) => {
        console.error("Profile Fetch Failed:", action.payload);
        state.isLoading = false;
      })
      .addCase(toggleSavedRecipe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(toggleSavedRecipe.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(toggleSavedRecipe.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export const {
  setUserProfile,
  updateCuisinePreferences,
  updateDietaryRestrictions,
  clearUserProfile,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;
