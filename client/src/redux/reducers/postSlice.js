import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  topic: "",
  description: "",
  tags: [],
  images: [],
  isResetState: true,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPost: (state, action) => {
      return { ...state, ...action.payload };
    },
    addTag: (state, action) => {
      state.tags = [...state.tags, action.payload];
    },
    removeTag: (state, action) => {
      state.tags = state.tags.filter((tag) => tag !== action.payload);
    },
    updatePostField: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    addImages: (state, action) => {
      state.images = [...state.images, ...action.payload];
    },
    deleteImage: (state, action) => {
      state.images = state.images.filter(
        (_, index) => index !== action.payload
      );
    },
    clearPost: () => initialState,
  },
});

export const {
  setPost,
  addTag,
  removeTag,
  updatePostField,
  addImages,
  deleteImage,
  clearPost,
} = postSlice.actions;

export default postSlice.reducer;
