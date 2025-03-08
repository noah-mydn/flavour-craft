// User Profile
const user = (state) => state.auth.user;
const isVerified = (state) => state.auth.isVerified;
const loading = (state) => state.auth.loading;
const error = (state) => state.auth.error;

export const userSelector = user;
export const isVerifiedSelector = isVerified;
export const loadingSelector = loading;
export const errorSelector = error;

//Preferences
const cuisinePreferences = (state) => state.userProfile.cuisinePreferences;
const dietaryRestrictions = (state) => state.userProfile.dietaryRestrictions;

export const cuisineSelectors = cuisinePreferences;
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

//Post
const post = (state) => state.post.post;
export const postSelector = post;
export const isResetSelector = (state) => state.post.isResetState;
