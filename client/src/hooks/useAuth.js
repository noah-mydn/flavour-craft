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
    // if (isVerified) {
    //   return navigate("/home");
    // }
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

    const updatedUser = user;

    if (updatedUser && isVerified) {
      console.log("is User First LoggedIn?", updatedUser?.isFirstLoggedIn);

      dispatch(setUserProfile(updatedUser));

      if (updatedUser.isFirstLoggedIn) {
        navigate("/pref");
      } else {
        navigate("/home");
      }
    } else if (updatedUser && updatedUser?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/auth");
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
