// User Profile

export const userSelector = (state) => state.auth.user;
export const isVerifiedSelector = (state) => state.auth.isVerified;
export const loadingSelector = (state) => state.auth.loading;
export const errorSelector = (state) => state.auth.error;
export const tokenSelector = (state) => state.auth.accessToken;

//Preferences
const cuisinePreferences = (state) => state.userProfile.cuisinePreferences;
const dietaryRestrictions = (state) => state.userProfile.dietaryRestrictions;
export const cuisinePrefSelector = cuisinePreferences;
export const dietaryRestrictionsSelectors = dietaryRestrictions;

//Recipes
const recipes = (state) => state.recipes.allRecipes;
const pagination = (state) => state.recipes.pagination;
const loadingRecipes = (state) => state.recipes.loading;
const errorRecipes = (state) => state.recipes.error;

export const recipesSelector = (state) => state.recipes.allRecipes;
export const paginationSelector = (state) => state.recipes.pagination;
export const loadingRecipesSelector = loadingRecipes;
export const errorRecipesSelector = errorRecipes;

//Cuisines
export const cuisinesSelector = (state) => state.cuisine.cuisines;
export const cuisinesLoadingSelector = (state) => state.cuisine.loading;
export const cuisinesErrorSelector = (state) => state.cuisine.error;
export const selectedCuisineSelector = (state) => state.cuisine.selectedCuisine;
export const cuisineLoadingSelector = (state) => state.cuisine.cuisineLoading;
export const cuisineErrorSelector = (state) => state.cuisine.cuisineError;

//Dietary
export const dietaryOptionsSelector = (state) => state.dietary.dietaryOptions;
export const optionsLoadingSelector = (state) => state.dietary.loading;
export const optionsErrorSelector = (state) => state.dietary.error;
export const dietaryLoadingSelector = (state) =>
  state.dietary.dietaryOptionLoading;
export const dietaryErrorSelector = (state) => state.dietary.dietaryError;
export const selectedDietaryOptionSelector = (state) =>
  state.cuisine.selectedDietaryOption;

//Post
const post = (state) => state.post.post;
export const postSelector = post;
export const isResetSelector = (state) => state.post.isResetState;
