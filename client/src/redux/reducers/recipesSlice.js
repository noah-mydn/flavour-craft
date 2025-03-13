import { createSlice } from "@reduxjs/toolkit";
import { fetchFilteredRecipes, fetchRecipes } from "../apiClients/recipeAPI";

const initialState = {
  // Sorting
  recipes: [],
  pagination: {},
  currentSort: "all",
  recipesLoading: false,
  recipesError: null,
  // Filtering
  filters: null,
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setRecipes(state, action) {
      state.recipes = action.payload.recipes;
      state.pagination = action.payload.pagination;
    },
    setSortType(state, action) {
      state.currentSort = action.payload; // Fix typo here
      state.filters = null;
    },
    setFilters(state, action) {
      state.filters = action.payload;
    },
    addRecipe(state, action) {
      state.recipes.push(action.payload);
    },
    deleteRecipe(state, action) {
      state.recipes = state.recipes.filter(
        (recipe) => recipe._id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Sorted Recipes
      .addCase(fetchRecipes.pending, (state) => {
        state.recipesLoading = true;
        state.recipesError = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.recipesLoading = false;
        state.recipes = action.payload.data.recipes;
        state.pagination = action.payload.data.pagination;
        state.currentSort = action.payload.sortValue;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.recipesLoading = false;
        state.recipesError = action.payload;
      })

      // Fetch Filtered Recipes
      .addCase(fetchFilteredRecipes.pending, (state) => {
        state.recipesLoading = true;
        state.recipesError = null;
      })
      .addCase(fetchFilteredRecipes.fulfilled, (state, action) => {
        state.recipesLoading = false;
        state.recipes = action.payload.data.recipes;
        state.pagination = action.payload.data.pagination;
        state.filters = action.payload.filters;
      })
      .addCase(fetchFilteredRecipes.rejected, (state, action) => {
        state.recipesLoading = false;
        state.recipesError = action.payload;
      });
  },
});

export const { setRecipes, addRecipe, deleteRecipe, setSortType, setFilters } =
  recipesSlice.actions;

export default recipesSlice.reducer;
