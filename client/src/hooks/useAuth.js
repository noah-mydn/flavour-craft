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
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

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
    // if (isVerified) {
    //   return navigate("/home");
    // }
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

    if (user && isVerified && user?.role !== "admin") {
      dispatch(setUserProfile(user));
      if (user.isFirstLoggedIn) {
        navigate("/pref");
      } else {
        navigate("/home");
      }
    } else if (user && isVerified && user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/auth");
    }
    // console.log(user);
    // dispatch(setUserProfile(user));
    // if (isVerified) {
    //   return navigate("/home");
    // }
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
