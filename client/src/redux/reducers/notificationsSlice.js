import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthConfig } from "../../utils/authHeaders";
import { displayErrorToast } from "../../utils/toastUtil";

const BASE_URL = process.env.REACT_APP_BASE_API + "/notifications";

// Fetch notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL, getAuthConfig());
      return response.data.notifications;
    } catch (error) {
      displayErrorToast(error);
      return rejectWithValue(error.response.data);
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: { notifications: [], unreadCount: 0 },
  reducers: {
    markAsRead: (state) => {
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.isRead).length;
    });
  },
});

export const { markAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;
