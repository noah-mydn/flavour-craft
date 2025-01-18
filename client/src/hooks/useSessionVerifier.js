import React from "react";
import { verifySession } from "../utils/verifySession";
import { useDispatch } from "react-redux";
import { refreshSession } from "../redux/apiClients/authAPI";
import { logout } from "../redux/reducers/authSlice";

export const useSessionVerifier = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    checkTokenStatus();
  }, dispatch);

  const checkTokenStatus = () => {
    let token = sessionStorage.getItem("accessToken");
    console.log(token);
    if (token) {
      const isTokenValid = verifySession();
      console.log(isTokenValid);
      //If not valid, check refresh token exists
      if (!isTokenValid) {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          dispatch(refreshSession());
        } else {
          dispatch(logout);
        }
      }
    }
  };
};
