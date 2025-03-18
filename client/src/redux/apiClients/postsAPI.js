import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthConfig } from "../../utils/authHeaders";
import { displayErrorToast } from "../../utils/toastUtil";

const BASE_URL = process.env.REACT_APP_BASE_API + "/posts";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}`, getAuthConfig());
      return response.data.posts;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (postId, { rejectWithValue }) => {
    console.log("POST ID:", postId);
    try {
      const response = await axios.get(
        `${BASE_URL}/${postId}`,
        getAuthConfig()
      );
      console.log("FETCH POST BY ID RESPONSE:", response.data.post);
      return response.data.post;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (postId, payload, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/${postId}`,
        payload,
        getAuthConfig()
      );
      return response.data.post;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/${postId}`, getAuthConfig());
      return postId;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response.data);
    }
  }
);

//Like /Remove Like Posts
export const likePost = createAsyncThunk(
  "posts/like",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/${postId}/upvote`,
        {},
        getAuthConfig()
      );

      return response.data.post;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response.data);
    }
  }
);
//Add Comments and if success fetch all comments to reload

export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, comment }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/${postId}/comment`,
        { content: comment },
        getAuthConfig()
      );
      return response.data.post;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response.data);
    }
  }
);
//Remove Comment
export const removeComment = createAsyncThunk(
  "posts/removeComment",
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/${postId}/comment/${commentId}`,
        getAuthConfig()
      );
      return response.data.post;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response.data);
    }
  }
);
//Update Comment
export const editComment = createAsyncThunk(
  "posts/updateComment",
  async ({ postId, commentId, comment }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/${postId}/comment/${commentId}`,
        { content: comment },
        getAuthConfig()
      );
      return response.data.post;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response.data);
    }
  }
);
//Get All Commments
export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/${postId}/comments`,
        getAuthConfig()
      );
      return response.data.comments;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response.data);
    }
  }
);
