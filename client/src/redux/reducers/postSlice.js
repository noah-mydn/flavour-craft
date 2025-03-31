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
      Object.assign(state, action.payload);
    },
    addTag: (state, action) => {
      if (!state.tags.includes(action.payload)) {
        state.tags.push(action.payload);
      }
    },
    removeTag: (state, action) => {
      state.tags = state.tags.filter((tag) => tag !== action.payload);
    },

    clearTags: (state) => {
      state.tags = [];
    },
    updatePostField: (state, action) => {
      state[action.payload.name] = action.payload.value;
    },
    addImages: (state, action) => {
      state.images.push(...action.payload);
    },
    deleteImage: (state, action) => {
      state.images.splice(action.payload, 1);
    },
    clearPost: () => initialState,
  },
});

export const {
  setPost,
  addTag,
  removeTag,
  clearTags,
  updatePostField,
  addImages,
  deleteImage,
  clearPost,
} = postSlice.actions;

export default postSlice.reducer;
