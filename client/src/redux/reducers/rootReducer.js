import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userProfileReducer from "./userProfileSlice";
import postReducer from "./postSlice";
import postListReducer from "./postListSlice";
import recipeReducer from "./recipesSlice";
import cuisineReducer from "./cuisineSlice";
import dietaryReducer from "./dietarySlice";
import notificationReducer from "./notificationsSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  userProfile: userProfileReducer,
  recipes: recipeReducer,
  post: postReducer,
  postList: postListReducer,
  notification: notificationReducer,
  cuisine: cuisineReducer,
  dietary: dietaryReducer,
});

export default rootReducer;
