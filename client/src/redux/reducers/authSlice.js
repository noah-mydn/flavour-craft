import { createSlice } from "@reduxjs/toolkit";
import { login, register } from "../apiClients/authAPI";

const storedUser = JSON.parse(sessionStorage.getItem("userData")) || null;
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
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      console.log("Removing accessToken from sessionStorage");
      sessionStorage.removeItem("accessToken");

      console.log("Removing userData from sessionStorage");
      sessionStorage.removeItem("userData");

      console.log("Removing refreshToken from localStorage");
      localStorage.removeItem("refreshToken");
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
        console.log("Login fulfilled payload:", action.payload);
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isVerified = true;
        sessionStorage.setItem("accessToken", state.accessToken);
        sessionStorage.setItem("userData", JSON.stringify(state.user));
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

        sessionStorage.setItem("accessToken", state.accessToken);
        sessionStorage.setItem("userData", JSON.stringify(state.user));
        localStorage.setItem("refreshToken", state.refreshToken);
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
