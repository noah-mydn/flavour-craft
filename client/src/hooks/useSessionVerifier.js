import React from "react";
import { verifySession } from "../utils/verifySession";
import { useDispatch } from "react-redux";
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
      const isTokenValid = verifySession(token);
      console.log(isTokenValid);
      if (!isTokenValid) {
        console.log("This runs!");
        dispatch(logout());
        window.location.href = "/auth";
      }
    } else {
      dispatch(logout());
      window.location.href = "/auth";
    }
  };
};
