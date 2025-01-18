import { createSelector } from "@reduxjs/toolkit";

const user = (state) => state.auth.user;
const accessToken = (state) => state.auth.accessToken;
const refreshToken = (state) => state.auth.refreshToken;
const isVerified = (state) => state.auth.isVerified;
const loading = (state) => state.auth.loading;
const error = (state) => state.auth.error;

export const userSelector = createSelector(user, (user) => user);
export const accessTokenSelector = createSelector(
  accessToken,
  (accessToken) => accessToken
);
export const refreshTokenSelector = createSelector(
  refreshToken,
  (refreshToken) => refreshToken
);
export const isVerifiedSelector = createSelector(
  isVerified,
  (isVerified) => isVerified
);
export const loadingSelector = createSelector(loading, (loading) => loading);
export const errorSelector = createSelector(error, (error) => error);
