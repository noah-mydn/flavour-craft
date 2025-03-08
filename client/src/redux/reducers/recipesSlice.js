import { createSlice } from "@reduxjs/toolkit";
import { fetchAllRecipes } from "../apiClients/recipeAPI";

const initialState = {
  allRecipes: [],
  pagination: {},
  recipe: null,
  loading: false,
  error: null,
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    // You can still use this if you want to set recipes manually later
    setRecipes(state, action) {
      state.allRecipes = action.payload;
    },
    addRecipe(state, action) {
      state.allRecipes.push(action.payload);
    },
    deleteRecipe(state, action) {
      state.allRecipes = state.allRecipes.filter(
        (recipe) => recipe._id !== action.payload // assuming "_id" is used as the identifier
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllRecipes.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAllRecipes.fulfilled, (state, action) => {
      // The API call will directly update the state
      state.allRecipes = action.payload.recipes;
      state.pagination = action.payload.pagination;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(fetchAllRecipes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Error fetching recipes";
    });
  },
});

export const { setRecipes, addRecipe, deleteRecipe } = recipesSlice.actions;

export default recipesSlice.reducer;
