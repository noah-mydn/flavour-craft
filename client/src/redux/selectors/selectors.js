// User
export const userSelector = (state) => state.auth.user;
export const isVerifiedSelector = (state) => state.auth.isVerified;
export const loadingSelector = (state) => state.auth.loading;
export const errorSelector = (state) => state.auth.error;
export const tokenSelector = (state) => state.auth.accessToken;

//Profile
export const profileSelector = (state) => state.userProfile.profile;

//Preferences
const cuisinePreferences = (state) => state.userProfile.cuisinePreferences;
const dietaryRestrictions = (state) => state.userProfile.dietaryRestrictions;
export const cuisinePrefSelector = cuisinePreferences;
export const dietaryRestrictionsSelectors = dietaryRestrictions;

//Recipes
export const recipesListSelector = (state) => state.recipes.recipes;
export const paginationSelector = (state) => state.recipes.pagination;
export const loadingRecipesSelector = (state) => state.recipes.recipesLoading;
export const errorRecipesSelector = (state) => state.recipes.recipesError;
export const filtersSelector = (state) => state.recipes.filters;
export const filterExistsSelector = (state) => state.recipes.filterExists;

//Recipe
export const recipeSelector = (state) => state.recipes.recipe;
export const recipeLoadingSelector = (state) => state.recipes.recipeLoading;
export const recipeErrorSelector = (state) => state.recipes.recipeError;

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
