import { createSlice } from "@reduxjs/toolkit";

const storedUserData = JSON.parse(sessionStorage.getItem("userData"));
console.log("StoredUserData:", storedUserData?.dietaryRestrictions);

const initialState = {
  id: "",
  userImg: "",
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  cuisinePreferences: storedUserData?.cuisinePreferences || [],
  dietaryRestrictions: storedUserData?.dietaryRestrictions || [],
  savedRecipes: [],
  ratedRecipes: [],
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      return { ...state, ...action.payload };
    },
    toggleSavedRecipe: (state, action) => {
      const recipeId = action.payload;

      const isAlreadySaved = state.savedRecipes.includes(recipeId);

      if (isAlreadySaved) {
        state.savedRecipes = state.savedRecipes.filter((id) => id !== recipeId);
      } else {
        state.savedRecipes.push(recipeId);
      }

      const storedUserData = sessionStorage.getItem("userData");
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        userData.savedRecipes = state.savedRecipes;
        sessionStorage.setItem("userData", JSON.stringify(userData));
      }
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

      const storedUserData = sessionStorage.getItem("userData");
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        userData.dietaryRestrictions = state.dietaryRestrictions;
        sessionStorage.setItem("userData", JSON.stringify(userData));
      }
    },
    clearUserProfile: () => initialState,
  },
});

export const {
  setUserProfile,
  toggleSavedRecipe,
  updateCuisinePreferences,
  updateDietaryRestrictions,
  clearUserProfile,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;
