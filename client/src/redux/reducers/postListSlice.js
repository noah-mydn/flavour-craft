import { createSlice } from "@reduxjs/toolkit";
import {
  fetchComments,
  fetchPostById,
  fetchPosts,
  likePost,
  removeComment,
  editComment,
  addComment,
} from "../apiClients/postsAPI";

const postListSlice = createSlice({
  name: "postList",
  initialState: {
    //posts
    posts: [],
    loading: false,
    error: null,
    //comments
    comments: [],
    commentsLoading: false,
    commentsError: null,
    //post
    postById: null,
    postLoading: false,
    postError: null,
    //comment
    comment: null,
    commentMode: null, // 'edit' or 'delete'
    commentLoading: false,
    commentError: null,
  },
  reducers: {
    setComment: (state, action) => {
      state.comment = action.payload.comment;
      state.commentMode = action.payload.mode;
    },
    clearComment: (state) => {
      state.comment = null;
      state.commentMode = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //fetch post by id
      .addCase(fetchPostById.pending, (state) => {
        state.postLoading = true;
        state.postError = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.postLoading = false;
        state.postById = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.postLoading = false;
        state.postError = action.error.message;
      })
      .addCase(addComment.pending, (state) => {
        state.commentsLoading = true;
        state.commentsError = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p._id === action.payload._id);
        if (post) {
          post.comments.push(action.payload.newComment);
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.commentsLoading = false;
        state.commentsError = action.error.message;
      })
      .addCase(removeComment.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p._id === action.payload._id);
        if (post) {
          post.comments = post.comments.filter(
            (comment) => comment._id !== action.meta.arg.commentId
          );
        }
      })
      //like post
      .addCase(likePost.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        );
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchComments.pending, (state) => {
        state.commentsLoading = true;
        state.commentsError = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.commentsLoading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.commentsLoading = false;
        state.commentsError = action.error.message;
      })
      //edit comment
      .addCase(editComment.pending, (state) => {
        state.commentLoading = true;
        state.commentError = null;
      })

      .addCase(editComment.rejected, (state, action) => {
        state.commentLoading = false;
        state.commentError = action.error.message;
      });
  },
});

export const { setComment, clearComment } = postListSlice.actions;
export default postListSlice.reducer;
