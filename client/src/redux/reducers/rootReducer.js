import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userProfileReducer from "./userProfileSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  userProfile: userProfileReducer,
});

export default rootReducer;
