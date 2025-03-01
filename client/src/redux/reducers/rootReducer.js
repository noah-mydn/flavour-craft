import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userProfileReducer from "./userProfileSlice";
import postReducer from "./postSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  userProfile: userProfileReducer,
  post: postReducer,
});

export default rootReducer;
