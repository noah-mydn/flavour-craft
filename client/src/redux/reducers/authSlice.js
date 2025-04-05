import { createSlice } from "@reduxjs/toolkit";
import { googleAuth, login, register } from "../apiClients/authAPI";

const storedUser =
  JSON.parse(sessionStorage.getItem("userData")) ||
  JSON.parse(sessionStorage.getItem("auth")) ||
  null;
const storedAccessToken = sessionStorage.getItem("accessToken") || null;
const storedRefreshToken = localStorage.getItem("refreshToken") || null;

console.log(
  "Initial state from storage:",
  storedUser,
  storedAccessToken,
  storedRefreshToken
);

const initialState = {
  user: storedUser,
  loading: false,
  error: null,
  accessToken: storedAccessToken,
  refreshToken: storedRefreshToken,
  isVerified: !!storedUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    logout: (state) => {
      console.log("Removing accessToken from sessionStorage");
      sessionStorage.removeItem("accessToken");

      console.log("Removing auth from sessionStorage");
      sessionStorage.removeItem("auth");
      sessionStorage.removeItem("userData");

      console.log("Removing refreshToken from localStorage");
      localStorage.removeItem("refreshToken");
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      window.location.href = "/auth";
    },
    setIsVerified: (state, action) => {
      state.isVerified = action.payload;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isVerified = true;
      state.error = null;
      sessionStorage.setItem("accessToken", state.accessToken);
      sessionStorage.setItem("auth", JSON.stringify(state.user));
      localStorage.setItem("refreshToken", state.refreshToken);
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
        console.log("Login fulfilled payload:", action.payload);
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isVerified = true;
        sessionStorage.setItem("accessToken", state.accessToken);
        sessionStorage.setItem("auth", JSON.stringify(state.user));
        localStorage.setItem("refreshToken", state.refreshToken);
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
        console.log("Register fulfilled payload:", action.payload);
        state.loading = false;
        state.user = action.payload.user;
        state.isVerified = true;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        console.log("Is Verified State:", state.isVerified);

        sessionStorage.setItem("accessToken", state.accessToken);
        sessionStorage.setItem("auth", JSON.stringify(state.user));
        localStorage.setItem("refreshToken", state.refreshToken);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isVerified = false;
      })
      .addCase(googleAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isVerified = false;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        console.log("Google Auth Fulfilled Payload:", action.payload);
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isVerified = true;
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isVerified = false;
      });
  },
});

export const { logout, setIsVerified } = authSlice.actions;
export default authSlice.reducer;
