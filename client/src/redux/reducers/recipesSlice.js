import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allRecipes: [],
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState: initialState,
  reducers: {},
});

export default recipesSlice.reducer;
