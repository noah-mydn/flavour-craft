import { createSlice } from "@reduxjs/toolkit";
import {
  getCurrentUserProfile,
  toggleSavedRecipe,
} from "../apiClients/userAPI";

const initialState = {
  id: "",
  userImg: "",
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  cuisinePreferences: [],
  dietaryRestrictions: [],
  savedRecipes: [],
  ratedRecipes: [],
  myRecipeGenerations: [],
  isLoading: false,
  error: null,
  status: null,
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
        state.status = "loading";
      })
      .addCase(getCurrentUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.id = action.payload.id;
        state.userImg = action.payload.userImg;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.email = action.payload.email;
        state.username = action.payload.username;
        state.cuisinePreferences = action.payload.cuisinePreferences;
        state.dietaryRestrictions = action.payload.dietaryRestrictions;
        state.savedRecipes = action.payload.savedRecipes;
        state.ratedRecipes = action.payload.ratedRecipes;
      })
      .addCase(getCurrentUserProfile.rejected, (state, action) => {
        console.error("Profile Fetch Failed:", action.payload);
        state.status = "failed";
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
