import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userProfileReducer from "./userProfileSlice";
import postReducer from "./postSlice";
import recipeReducer from "./recipesSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  userProfile: userProfileReducer,
  recipes: recipeReducer,
  post: postReducer,
});

export default rootReducer;
