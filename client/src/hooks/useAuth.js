import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import {
  userSelector,
  loadingSelector,
  errorSelector,
  isVerifiedSelector,
} from "../redux/selectors/selectors";
import { login, register } from "../redux/apiClients/authAPI";
import React from "react";
import { setUserProfile } from "../redux/reducers/userProfileSlice";
import { logout } from "../redux/reducers/authSlice";
import { displayErrorToast } from "../utils/toastUtil";
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(userSelector);
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
  };

  const accountRegister = async (e) => {
    e.preventDefault();

    if (!accountUser?.termsAndConditions) {
      displayErrorToast({
        title: "Error",
        message: "You must agree to the terms and conditions to register",
      });
      return;
    }

    await dispatch(
      register({
        firstName: accountUser.firstName,
        lastName: accountUser.lastName,
        email: accountUser.email,
        password: accountUser.password,
      })
    );

    if (user && isVerified) {
      console.log("This runs!");
      dispatch(setUserProfile(user));
    }
  };

  //Logout
  const accountLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    accountLogin,
    accountRegister,
    accountUser,
    handleInputChange,
    accountLogout,
  };
};
