import { createSlice } from "@reduxjs/toolkit";
import {
  fetchFilteredRecipes,
  fetchRecipeById,
  fetchRecipes,
  searchRecipe,
} from "../apiClients/recipeAPI";

const initialState = {
  // Sorting
  recipes: [],
  pagination: {},
  currentSort: "all",
  recipesLoading: false,
  recipesError: null,
  // Filtering
  filters: false,
  filterExists: false,
  //Single recipe
  recipe: null,
  recipeLoading: false,
  recipeError: null,
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setRecipes(state, action) {
      state.recipes = action.payload.recipes;
    },
    setPagination(state, action) {
      state.pagination = action.payload.pagination;
    },
    setSortType(state, action) {
      state.currentSort = action.payload;
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
        state.filterExists = false;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.recipesLoading = false;
        state.recipes = action.payload.data.recipes;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.recipesLoading = false;
        state.recipesError = action.payload;
      })

      // Fetch Filtered Recipes
      .addCase(fetchFilteredRecipes.pending, (state) => {
        state.recipesLoading = true;
        state.recipesError = null;
        state.filterExists = false;
      })
      .addCase(fetchFilteredRecipes.fulfilled, (state, action) => {
        console.log("Filtered recipes:", action.payload);
        state.recipesLoading = false;
        state.recipes = action.payload?.recipes || [];
        state.pagination = action.payload?.pagination;
      })
      .addCase(fetchFilteredRecipes.rejected, (state, action) => {
        state.recipesLoading = false;
        state.recipesError = action.payload;
      })
      .addCase(fetchRecipeById.pending, (state, action) => {
        state.recipeLoading = true;
        state.recipeError = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.recipeLoading = false;
        state.recipe = action.payload;
        state.recipeError = null;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.recipeLoading = false;
        state.recipeError = action.payload;
      })
      .addCase(searchRecipe.pending, (state) => {
        state.recipesLoading = true;
        state.recipesError = null;
      })
      .addCase(searchRecipe.fulfilled, (state, action) => {
        console.log("ACTION:", action.payload);
        state.recipesLoading = false;
        state.recipes = action.payload.recipes;
        state.pagination = action.payload.pagination;
      })
      .addCase(searchRecipe.rejected, (state, action) => {
        state.recipesLoading = false;
        state.recipesError = action.payload;
      });
  },
});

export const {
  setRecipes,
  addRecipe,
  deleteRecipe,
  setSortType,
  setFilters,
  setPagination,
} = recipesSlice.actions;

export default recipesSlice.reducer;
