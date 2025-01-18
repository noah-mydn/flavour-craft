import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  userSelector,
  loadingSelector,
  errorSelector,
  accessTokenSelector,
  refreshTokenSelector,
  isVerifiedSelector,
} from "../redux/selectors/selectors";
import { login } from "../redux/apiClients/authAPI";
import React from "react";
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(userSelector);
  const loading = useSelector(loadingSelector);
  const error = useSelector(errorSelector);
  const accessToken = useSelector(accessTokenSelector);
  const refreshToken = useSelector(refreshTokenSelector);
  const isVerified = useSelector(isVerifiedSelector);

  const [accountUser, setAccountUser] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  //TextField Value On Change
  const handleInputChange = (e) => {
    setAccountUser({ ...accountUser, [e.target.name]: e.target.value });
  };

  //Login
  const accountLogin = () => {
    dispatch(login(accountUser));
    console.log(user);
    if (isVerified) {
      return navigate("/home");
    }
  };
  return {
    user,
    accountLogin,
    accountUser,
    handleInputChange,
  };
};
