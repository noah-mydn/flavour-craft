import { createSlice } from "@reduxjs/toolkit";
import { fetchRecipes } from "../apiClients/recipeAPI";

const initialState = {
  allRecipes: [],
  pagination: {},
  currentSort: "all",
  recipesLoading: false,
  recipesError: null,
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setRecipes(state, action) {
      state.allRecipes = action.payload;
    },
    addRecipe(state, action) {
      state.allRecipes.push(action.payload);
    },
    deleteRecipe(state, action) {
      state.allRecipes = state.allRecipes.filter(
        (recipe) => recipe._id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.recipesLoading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.recipesLoading = false;
        state.allRecipes = action.payload.data.recipes;
        state.pagination = action.payload.data.pagination;
        state.currentSort = action.payload.sortValue;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.recipesLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setRecipes, addRecipe, deleteRecipe } = recipesSlice.actions;

export default recipesSlice.reducer;
