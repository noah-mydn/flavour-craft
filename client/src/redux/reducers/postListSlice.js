import { createSlice } from "@reduxjs/toolkit";
import {
  fetchComments,
  fetchPostById,
  fetchPosts,
  likePost,
  removeComment,
  editComment,
  addComment,
  deletePost,
} from "../apiClients/postsAPI";

const postListSlice = createSlice({
  name: "postList",
  initialState: {
    posts: [],
    loading: false,
    error: null,
    comments: [],
    commentsLoading: false,
    commentsError: null,
    pagination: null,
    postById: null,
    postLoading: false,
    postError: null,
    comment: null,
    commentMode: null,
    commentLoading: false,
    commentError: null,
  },
  reducers: {
    setComment: (state, action) => {
      state.comment = action.payload.comment;
      state.commentMode = action.payload.mode;
    },
    setComments: (state, action) => {
      state.comments = action.payload.comments;
      state.commentsLoading = false;
      state.commentsError = null;
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
        state.posts = action.payload.posts;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
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
        state.postError = action.error.message || "Something went wrong";
      })
      .addCase(addComment.pending, (state) => {
        state.commentsLoading = true;
        state.commentsError = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.commentLoading = false;
        state.comments = [...(state.comments || []), action.payload];
      })
      .addCase(addComment.rejected, (state, action) => {
        state.commentLoading = false;
        state.commentError = action.error.message || "Something went wrong";
      })
      .addCase(removeComment.pending, (state) => {
        state.commentLoading = true;
        state.commentsLoading = true;
        state.commentError = null;
      })
      .addCase(removeComment.fulfilled, (state, action) => {
        state.commentLoading = false;

        state.comments.filter((comment) => {
          return comment.id !== action.payload;
        });
        state.commentsLoading = true;
      })
      .addCase(removeComment.rejected, (state, action) => {
        state.commentLoading = false;
        state.commentError = action.payload;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, userId } = action.payload;
        state.posts = state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                upvotes: post.upvotes.includes(userId)
                  ? post.upvotes.filter((id) => id !== userId)
                  : [...post.upvotes, userId],
              }
            : post
        );
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.error.message || "Something went wrong";
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
        state.commentsError = action.error.message || "Something went wrong";
      })
      .addCase(editComment.pending, (state) => {
        state.commentLoading = true;
        state.commentError = null;
      })
      .addCase(editComment.fulfilled, (state, action) => {
        state.commentLoading = false;
        state.comments = state.comments.map((comment) =>
          comment._id === action.payload._id
            ? { ...comment, content: action.payload.content }
            : comment
        );
      })
      .addCase(editComment.rejected, (state, action) => {
        state.commentLoading = false;
        state.commentError = action.error.message || "Something went wrong";
      })
      .addCase(deletePost.pending, (state, action) => {
        state.postLoading = true;
        state.postError = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.postLoading = false;
        state.posts = state.posts.filter((post) => post._id !== action.payload);
        state.postError = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.postLoading = false;
        state.postError = action.error.message || "Something went wrong";
      });
  },
});

export const { setComment, clearComment, setComments } = postListSlice.actions;
export default postListSlice.reducer;
