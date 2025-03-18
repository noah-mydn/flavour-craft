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

//Post (create)
export const postSelector = (state) => state.post;
export const tagsSelector = (state) => state.post.tags;
export const isResetSelector = (state) => state.post.isResetState;
//Post Lists
export const postListSelector = (state) => state.postList.posts;
export const postsLoadingSelector = (state) => state.postList.loading;
export const postsErrorSelector = (state) => state.postList.error;
//Post (edit,delete)
export const postByIdSelector = (state) => state.postList.postById;
export const postLoadingSelector = (state) => state.postList.postLoading;
export const postErrorSelector = (state) => state.postList.postError;
//Comments
export const commentsSelector = (state) => state.postList.comments;
export const commentsLoadingSelector = (state) =>
  state.postList.commentsLoading;
export const commentsErrorSelector = (state) => state.postList.commentsError;
//Comment
export const commentSelector = (state) => state.postList.comment;
export const commentLoadingSelector = (state) => state.postList.commentLoading;
export const commentErrorSelector = (state) => state.postList.commentError;
