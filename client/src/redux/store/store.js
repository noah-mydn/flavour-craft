import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../reducers/rootReducer";
import localStorageMiddleWare from "../../utils/localStorageMiddleware";

const store = configureStore({
  reducer: rootReducer,
});

export default store;
