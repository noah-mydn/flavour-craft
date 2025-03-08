import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import {
  userSelector,
  loadingSelector,
  errorSelector,
  accessTokenSelector,
  refreshTokenSelector,
  isVerifiedSelector,
} from "../redux/selectors/selectors";
import { googleAuth, login, register } from "../redux/apiClients/authAPI";
import React from "react";
import { setUserProfile } from "../redux/reducers/userProfileSlice";
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(userSelector);
  const loading = useSelector(loadingSelector);
  const error = useSelector(errorSelector);
  const isVerified = useSelector(isVerifiedSelector);

  const [accountUser, setAccountUser] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    termsAndConditions: true,
  });

  //TextField and Checkbox Value On Change
  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    setAccountUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  //Login
  const accountLogin = (e) => {
    e.preventDefault();
    dispatch(login(accountUser));
    console.log(user);
    dispatch(setUserProfile(user));
    if (isVerified) {
      return navigate("/home");
    }
  };

  //Register
  const accountRegister = (e) => {
    e.preventDefault();
    dispatch(
      register({
        firstName: accountUser.firstName,
        lastName: accountUser.lastName,
        email: accountUser.email,
        password: accountUser.password,
      })
    );
    console.log(user);
    dispatch(setUserProfile(user));
    if (isVerified) {
      return navigate("/home");
    }
  };

  // Google Login
  const googleAuthHandler = (token) => {
    console.log("Google Token:", token);
    dispatch(googleAuth(token));
  };

  const googleLogin = () => {
    window.location.href = "http://localhost:8080/auth/google";
  };

  return {
    user,
    accountLogin,
    accountRegister,
    accountUser,
    handleInputChange,
    googleLogin,
  };
};
