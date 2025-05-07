import { createSlice } from "@reduxjs/toolkit";
import {
  getCurrentUserProfile,
  setCuisinePreferences,
  setDietaryPreferences,
  toggleSavedRecipe,
  updateUserProfile,
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
    rateRecipes: (state, action) => {
      const { recipeId, rating } = action.payload;
      if (state.profile?.ratedRecipes) {
        const recipeIndex = state.profile.ratedRecipes.findIndex(
          (recipe) => recipe.recipeId === recipeId
        );
        if (recipeIndex !== -1) {
          console.log(
            "Previous rating:",
            state.profile.ratedRecipes[recipeIndex].rating
          );
          state.profile.ratedRecipes[recipeIndex].rating = rating;
          console.log(
            "New rating:",
            state.profile.ratedRecipes[recipeIndex].rating
          );
        } else {
          state.profile.ratedRecipes.push({ recipeId, rating });
        }
      }
    },
    saveRecipe: (state, action) => {
      state.profile.savedRecipes.push(action.payload);
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
      })
      .addCase(setDietaryPreferences.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setDietaryPreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        //store only Ids
        state.profile.dietaryPreferences = action.payload.map(
          (item) => item.id
        );
      })
      .addCase(setDietaryPreferences.rejected, (state, action) => {
        console.error("Dietary Preferences Fetch Failed:", action.payload);
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(setCuisinePreferences.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setCuisinePreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        //store only Ids
        state.profile.cuisinePreferences = action.payload.map(
          (item) => item.id
        );
      })
      .addCase(setCuisinePreferences.rejected, (state, action) => {
        console.error("Cuisine Preferences Fetch Failed:", action.payload);
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setUserProfile,
  updateCuisinePreferences,
  updateDietaryRestrictions,
  clearUserProfile,
  rateRecipes,
  saveRecipe,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;
