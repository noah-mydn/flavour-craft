import { createSlice } from "@reduxjs/toolkit";
import { login, register } from "../apiClients/authAPI";

const initialState = {
  user: null,
  loading: false,
  error: null,
  accessToken: null,
  refreshToken: null,
  isVerified: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
    setIsVerified: (state, action) => {
      state.isVerified = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isVerified = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isVerified = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isVerified = false;
      })
      //Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isVerified = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isVerified = true;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isVerified = false;
      });
  },
});

export const { logout, setIsVerified } = authSlice.actions;
export default authSlice.reducer;
