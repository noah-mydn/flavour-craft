import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userProfileReducer from "./userProfileSlice";
import postReducer from "./postSlice";
import recipeReducer from "./recipesSlice";
import cuisineReducer from "./cuisineSlice";
import dietaryReducer from "./dietarySlice";

const rootReducer = combineReducers({
  auth: authReducer,
  userProfile: userProfileReducer,
  recipes: recipeReducer,
  post: postReducer,
  cuisine: cuisineReducer,
  dietary: dietaryReducer,
});

export default rootReducer;
